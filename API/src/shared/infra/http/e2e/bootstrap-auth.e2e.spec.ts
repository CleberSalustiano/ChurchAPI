import request from "supertest";
import app from "../app";

const bootstrapPayload = {
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

describe("E2E bootstrap and authentication flows", () => {
  it("should bootstrap the first headquarter and require a password change before protected access", async () => {
    const bootstrapResponse = await request(app)
      .post("/church/bootstrap")
      .send(bootstrapPayload);

    expect(bootstrapResponse.status).toBe(200);
    expect(bootstrapResponse.body.church.type).toBe("HEADQUARTER");
    expect(bootstrapResponse.body.member.cpf).toBe("12345678901");

    const firstLoginResponse = await request(app).post("/session").send({
      login: "lider.sede",
      password: "12345678901",
    });

    expect(firstLoginResponse.status).toBe(200);
    expect(firstLoginResponse.body.mustChangePassword).toBe(true);
    expect(firstLoginResponse.body.access.scope).toBe("GLOBAL");
    expect(firstLoginResponse.body.access.level).toBe("EDITOR");
    expect(firstLoginResponse.body.permissions.canEditManagementData).toBe(true);

    const protectedBeforePasswordChange = await request(app)
      .get("/church")
      .set("Authorization", `Bearer ${firstLoginResponse.body.token}`);

    expect(protectedBeforePasswordChange.status).toBe(403);
    expect(protectedBeforePasswordChange.body.error).toContain(
      "Password change is required"
    );

    const changePasswordResponse = await request(app)
      .patch(`/user/${firstLoginResponse.body.user.id}/password`)
      .set("Authorization", `Bearer ${firstLoginResponse.body.token}`)
      .send({
        password: "NovaSenha123",
      });

    expect(changePasswordResponse.status).toBe(200);

    const secondLoginResponse = await request(app).post("/session").send({
      login: "lider.sede",
      password: "NovaSenha123",
    });

    expect(secondLoginResponse.status).toBe(200);
    expect(secondLoginResponse.body.mustChangePassword).toBe(false);
    expect(secondLoginResponse.body.access.level).toBe("EDITOR");

    const profileResponse = await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${secondLoginResponse.body.token}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.user.login).toBe("lider.sede");
    expect(profileResponse.body.permissions.canEditManagementData).toBe(true);

    const churchesResponse = await request(app)
      .get("/church")
      .set("Authorization", `Bearer ${secondLoginResponse.body.token}`);

    expect(churchesResponse.status).toBe(200);
    expect(churchesResponse.body.churches).toHaveLength(1);
    expect(churchesResponse.body.churches[0].type).toBe("HEADQUARTER");
  });

  it("should execute the forgot/reset password flow end to end", async () => {
    const bootstrapResponse = await request(app)
      .post("/church/bootstrap")
      .send(bootstrapPayload);

    expect(bootstrapResponse.status).toBe(200);

    const forgotResponse = await request(app).post("/password/forgot").send({
      email: "lider.sede@churchapp.local",
    });

    expect(forgotResponse.status).toBe(200);
    expect(forgotResponse.body.resetToken).toBeTruthy();

    const resetResponse = await request(app).post("/password/reset").send({
      token: forgotResponse.body.resetToken,
      password: "SenhaReset123",
    });

    expect(resetResponse.status).toBe(200);

    const loginResponse = await request(app).post("/session").send({
      login: "lider.sede",
      password: "SenhaReset123",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.mustChangePassword).toBe(false);
  });
});
