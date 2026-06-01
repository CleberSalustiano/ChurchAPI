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
  await request(app).post("/church/bootstrap").send(headquarterBootstrapPayload).expect(200);

  const firstLoginResponse = await request(app).post("/session").send({
    login: "lider.sede",
    password: "12345678901",
  });

  await request(app)
    .patch(`/user/${firstLoginResponse.body.user.id}/password`)
    .set("Authorization", `Bearer ${firstLoginResponse.body.token}`)
    .send({
      password: "NovaSenha123",
    })
    .expect(200);

  return request(app).post("/session").send({
    login: "lider.sede",
    password: "NovaSenha123",
  });
}

describe("E2E cult workflow enhancements", () => {
  it("should create recurring cults, register cult offers and let the member update the own profile", async () => {
    const headquarterLoginResponse = await bootstrapAndAuthenticateHeadquarter();
    const globalToken = headquarterLoginResponse.body.token;
    const headquarterChurchId = headquarterLoginResponse.body.access.churchId;

    const treasurerMemberResponse = await request(app)
      .post("/member")
      .set("Authorization", `Bearer ${globalToken}`)
      .send({
        id_church: headquarterChurchId,
        name: "Tesoureiro da Sede",
        birth_date: "1991-05-12",
        batism_date: "2010-09-03",
        ecclesiasticalRole: "Cooperador",
        cpf: "34567890123",
        rg: 345678901,
        login: "tesoureiro.sede",
        email: "tesoureiro.sede@churchapp.local",
        password: "1234",
      })
      .expect(200);

    const createTreasurerResponse = await request(app)
      .post(`/treasurer/${treasurerMemberResponse.body.member.id}`)
      .set("Authorization", `Bearer ${globalToken}`)
      .expect(200);

    const firstTreasurerLoginResponse = await request(app).post("/session").send({
      login: "tesoureiro.sede",
      password: "1234",
    });

    await request(app)
      .patch(`/user/${firstTreasurerLoginResponse.body.user.id}/password`)
      .set("Authorization", `Bearer ${firstTreasurerLoginResponse.body.token}`)
      .send({
        password: "Tesoureiro123",
      })
      .expect(200);

    const treasurerLoginResponse = await request(app).post("/session").send({
      login: "tesoureiro.sede",
      password: "Tesoureiro123",
    });

    const treasurerToken = treasurerLoginResponse.body.token;
    const treasurerId = createTreasurerResponse.body.treasurer.id;
    const treasurerMemberId = treasurerLoginResponse.body.member.id;

    const recurringCultResponse = await request(app)
      .post("/cult/recurring")
      .set("Authorization", `Bearer ${treasurerToken}`)
      .send({
        id_church: headquarterChurchId,
        date: "2024-07-07",
        theme: "Culto de domingo",
        recurrence: {
          interval: 1,
          until: "2024-07-28",
        },
      })
      .expect(200);

    expect(recurringCultResponse.body.cults).toHaveLength(4);
    expect(recurringCultResponse.body.cults[0].recurrenceGroup).toBeTruthy();

    const firstCultId = recurringCultResponse.body.cults[0].id;

    await request(app)
      .put(`/cult/${firstCultId}`)
      .set("Authorization", `Bearer ${treasurerToken}`)
      .send({
        id_church: headquarterChurchId,
        date: "2024-07-07",
        theme: "Culto de familia",
      })
      .expect(200);

    const updateSeriesResponse = await request(app)
      .put(`/cult/${firstCultId}/series`)
      .set("Authorization", `Bearer ${treasurerToken}`)
      .send({
        id_church: headquarterChurchId,
        theme: "Culto de familia",
      })
      .expect(200);

    expect(updateSeriesResponse.body.cults).toHaveLength(4);
    expect(
      updateSeriesResponse.body.cults.every(
        (cult: { theme: string }) => cult.theme === "Culto de familia"
      )
    ).toBe(true);

    const createCultOfferResponse = await request(app)
      .post(`/cult/${firstCultId}/offers`)
      .set("Authorization", `Bearer ${treasurerToken}`)
      .send({
        id_treasurer: treasurerId,
        value: 480,
      })
      .expect(200);

    expect(createCultOfferResponse.body.cultOffer.offer.value).toBe(480);

    const updateCultOfferResponse = await request(app)
      .put(`/cult/${firstCultId}/offers/${createCultOfferResponse.body.cultOffer.id}`)
      .set("Authorization", `Bearer ${treasurerToken}`)
      .send({
        id_treasurer: treasurerId,
        value: 525,
      })
      .expect(200);

    expect(updateCultOfferResponse.body.cultOffer.offer.value).toBe(525);

    await request(app)
      .delete(`/cult/${firstCultId}/offers/${createCultOfferResponse.body.cultOffer.id}`)
      .set("Authorization", `Bearer ${treasurerToken}`)
      .expect(200);

    const profileUpdateResponse = await request(app)
      .patch(`/member/${treasurerMemberId}/profile`)
      .set("Authorization", `Bearer ${treasurerToken}`)
      .send({
        name: "Tesoureiro Atualizado",
        email: "tesoureiro.atualizado@churchapp.local",
        birth_date: "1991-06-01",
        rg: 987654321,
      })
      .expect(200);

    expect(profileUpdateResponse.body.member.name).toBe("Tesoureiro Atualizado");
    expect(profileUpdateResponse.body.member.email).toBe(
      "tesoureiro.atualizado@churchapp.local"
    );

    const meResponse = await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${treasurerToken}`)
      .expect(200);

    expect(meResponse.body.member.name).toBe("Tesoureiro Atualizado");
    expect(meResponse.body.member.church.location.city).toBe("Sao Paulo");
  });
});
