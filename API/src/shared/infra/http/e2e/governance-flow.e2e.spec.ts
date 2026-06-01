import request from "supertest";
import app from "../app";

const headquarterBootstrapPayload = {
  church: {
    date: "2024-01-15",
    street: "Rua Central",
    district: "Centro",
    city: "Sao Paulo",
    state: "SP",
    country: "Brasil",
    cep: 1001000,
    type: "HEADQUARTER" as const,
  },
  manager: {
    name: "Lider da Sede",
    birth_date: "1990-01-10",
    batism_date: "2005-02-20",
    ecclesiasticalRole: "Dirigente",
    cpf: "12345678901",
    rg: 123456789,
    login: "lider.sede",
    email: "lider.sede@churchapp.local",
  },
};

async function bootstrapAndAuthenticateHeadquarter() {
  const bootstrapResponse = await request(app)
    .post("/church/bootstrap")
    .send(headquarterBootstrapPayload);

  expect(bootstrapResponse.status).toBe(200);

  const initialLoginResponse = await request(app).post("/session").send({
    login: "lider.sede",
    password: "12345678901",
  });

  await request(app)
    .patch(`/user/${initialLoginResponse.body.user.id}/password`)
    .set("Authorization", `Bearer ${initialLoginResponse.body.token}`)
    .send({
      password: "NovaSenha123",
    });

  return request(app).post("/session").send({
    login: "lider.sede",
    password: "NovaSenha123",
  });
}

describe("E2E governance flows", () => {
  it("should create a branch with an initial manager and replace the branch manager without leaving the church unmanaged", async () => {
    const headquarterLoginResponse = await bootstrapAndAuthenticateHeadquarter();
    const globalToken = headquarterLoginResponse.body.token;

    const createBranchResponse = await request(app)
      .post("/church/structured")
      .set("Authorization", `Bearer ${globalToken}`)
      .send({
        church: {
          date: "2024-02-10",
          street: "Rua da Filial",
          district: "Bairro Novo",
          city: "Campinas",
          state: "SP",
          country: "Brasil",
          cep: 1301000,
          type: "BRANCH",
        },
        manager: {
          name: "Lider da Filial",
          birth_date: "1992-03-05",
          batism_date: "2008-08-15",
          ecclesiasticalRole: "Dirigente",
          cpf: "23456789012",
          rg: 234567890,
          login: "lider.filial",
          email: "lider.filial@churchapp.local",
          password: "1234",
        },
      });

    expect(createBranchResponse.status).toBe(200);
    expect(createBranchResponse.body.church.type).toBe("BRANCH");
    expect(createBranchResponse.body.manager.id_church).toBe(
      createBranchResponse.body.church.id
    );

    const branchFirstLoginResponse = await request(app).post("/session").send({
      login: "lider.filial",
      password: "1234",
    });

    expect(branchFirstLoginResponse.status).toBe(200);
    expect(branchFirstLoginResponse.body.mustChangePassword).toBe(true);
    expect(branchFirstLoginResponse.body.access.scope).toBe("CHURCH");
    expect(branchFirstLoginResponse.body.access.level).toBe("VIEWER");

    await request(app)
      .patch(`/user/${branchFirstLoginResponse.body.user.id}/password`)
      .set("Authorization", `Bearer ${branchFirstLoginResponse.body.token}`)
      .send({
        password: "FilialSenha123",
      })
      .expect(200);

    const branchSecondLoginResponse = await request(app).post("/session").send({
      login: "lider.filial",
      password: "FilialSenha123",
    });

    const branchChurchViewResponse = await request(app)
      .get("/church")
      .set("Authorization", `Bearer ${branchSecondLoginResponse.body.token}`);

    expect(branchChurchViewResponse.status).toBe(200);
    expect(branchChurchViewResponse.body.churches).toHaveLength(1);
    expect(branchChurchViewResponse.body.churches[0].id).toBe(
      createBranchResponse.body.church.id
    );

    const replacementMemberResponse = await request(app)
      .post("/member")
      .set("Authorization", `Bearer ${globalToken}`)
      .send({
        id_church: createBranchResponse.body.church.id,
        name: "Sucessor da Filial",
        birth_date: "1994-06-12",
        batism_date: "2011-09-22",
        ecclesiasticalRole: "Membro",
        cpf: "34567890123",
        rg: 345678901,
        login: "sucessor.filial",
        email: "sucessor.filial@churchapp.local",
      });

    expect(replacementMemberResponse.status).toBe(200);

    const replaceManagerResponse = await request(app)
      .post(`/manager/${createBranchResponse.body.manager.id}/replace`)
      .set("Authorization", `Bearer ${globalToken}`)
      .send({
        id_member: replacementMemberResponse.body.member.id,
      });

    expect(replaceManagerResponse.status).toBe(200);
    expect(replaceManagerResponse.body.manager.id_member).toBe(
      replacementMemberResponse.body.member.id
    );
    expect(replaceManagerResponse.body.previousManager.endDate).toBeTruthy();

    const formerManagerLoginResponse = await request(app).post("/session").send({
      login: "lider.filial",
      password: "FilialSenha123",
    });

    expect(formerManagerLoginResponse.status).toBe(200);
    expect(formerManagerLoginResponse.body.access.level).toBe("MEMBER");
    expect(formerManagerLoginResponse.body.permissions.canViewManagementData).toBe(
      false
    );

    const deleteOnlyActiveManagerResponse = await request(app)
      .delete(`/manager/${replaceManagerResponse.body.manager.id}`)
      .set("Authorization", `Bearer ${globalToken}`);

    expect(deleteOnlyActiveManagerResponse.status).toBe(400);
    expect(deleteOnlyActiveManagerResponse.body.error).toContain(
      "Church must keep at least one active manager"
    );

    const deleteOnlyActiveManagerMemberResponse = await request(app)
      .delete(`/member/${replacementMemberResponse.body.member.id}`)
      .set("Authorization", `Bearer ${globalToken}`);

    expect(deleteOnlyActiveManagerMemberResponse.status).toBe(400);
    expect(deleteOnlyActiveManagerMemberResponse.body.error).toContain(
      "Cannot inactivate the only active manager"
    );
  });
});
