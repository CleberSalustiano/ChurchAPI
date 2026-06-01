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
    })
    .expect(200);

  return request(app).post("/session").send({
    login: "lider.sede",
    password: "NovaSenha123",
  });
}

describe("E2E financial flows", () => {
  it("should allow a scoped treasurer to operate the financial routes end to end", async () => {
    const headquarterLoginResponse = await bootstrapAndAuthenticateHeadquarter();
    const globalToken = headquarterLoginResponse.body.token;

    const createBranchResponse = await request(app)
      .post("/church/structured")
      .set("Authorization", `Bearer ${globalToken}`)
      .send({
        church: {
          date: "2024-02-10",
          street: "Rua Financeira",
          district: "Centro Financeiro",
          city: "Campinas",
          state: "SP",
          country: "Brasil",
          cep: 1301000,
          type: "BRANCH",
        },
        manager: {
          name: "Dirigente Financeiro",
          birth_date: "1992-03-05",
          batism_date: "2008-08-15",
          ecclesiasticalRole: "Dirigente",
          cpf: "23456789012",
          rg: 234567890,
          login: "lider.financeiro",
          email: "lider.financeiro@churchapp.local",
          password: "1234",
        },
      });

    expect(createBranchResponse.status).toBe(200);

    const treasurerMemberResponse = await request(app)
      .post("/member")
      .set("Authorization", `Bearer ${globalToken}`)
      .send({
        id_church: createBranchResponse.body.church.id,
        name: "Tesoureiro da Filial",
        birth_date: "1991-05-12",
        batism_date: "2010-09-03",
        ecclesiasticalRole: "Cooperador",
        cpf: "34567890123",
        rg: 345678901,
        login: "tesoureiro.filial",
        email: "tesoureiro.filial@churchapp.local",
        password: "1234",
      });

    expect(treasurerMemberResponse.status).toBe(200);

    const createTreasurerResponse = await request(app)
      .post(`/treasurer/${treasurerMemberResponse.body.member.id}`)
      .set("Authorization", `Bearer ${globalToken}`);

    expect(createTreasurerResponse.status).toBe(200);

    const firstTreasurerLoginResponse = await request(app).post("/session").send({
      login: "tesoureiro.filial",
      password: "1234",
    });

    expect(firstTreasurerLoginResponse.status).toBe(200);
    expect(firstTreasurerLoginResponse.body.mustChangePassword).toBe(true);
    expect(firstTreasurerLoginResponse.body.access.level).toBe("EDITOR");
    expect(firstTreasurerLoginResponse.body.access.scope).toBe("CHURCH");

    await request(app)
      .patch(`/user/${firstTreasurerLoginResponse.body.user.id}/password`)
      .set("Authorization", `Bearer ${firstTreasurerLoginResponse.body.token}`)
      .send({
        password: "Tesouraria123",
      })
      .expect(200);

    const treasurerLoginResponse = await request(app).post("/session").send({
      login: "tesoureiro.filial",
      password: "Tesouraria123",
    });

    const treasurerToken = treasurerLoginResponse.body.token;
    const treasurerId = createTreasurerResponse.body.treasurer.id;
    const churchId = createBranchResponse.body.church.id;
    const memberId = treasurerMemberResponse.body.member.id;

    const createCostResponse = await request(app)
      .post("/cost")
      .set("Authorization", `Bearer ${treasurerToken}`)
      .send({
        value: 420.5,
        date: "2024-05-18",
        description: "Som e cabos",
        id_church: churchId,
      });

    expect(createCostResponse.status).toBe(200);
    expect(createCostResponse.body.cost.description).toBe("Som e cabos");
    const costId = createCostResponse.body.cost.id;

    const createOfferResponse = await request(app)
      .post("/offer")
      .set("Authorization", `Bearer ${treasurerToken}`)
      .send({
        id_treasurer: treasurerId,
        value: 950,
      });

    expect(createOfferResponse.status).toBe(200);
    expect(createOfferResponse.body.offer.value).toBe(950);
    const offerId = createOfferResponse.body.offer.id;

    const createSpecialOfferResponse = await request(app)
      .post("/specialOffer")
      .set("Authorization", `Bearer ${treasurerToken}`)
      .send({
        id_church: churchId,
        id_member: memberId,
        id_treasurer: treasurerId,
        value: 1200,
        reason: "Reforma do templo",
        date: "2024-05-20",
      });

    expect(createSpecialOfferResponse.status).toBe(200);
    expect(createSpecialOfferResponse.body.specialOffer.reason).toBe(
      "Reforma do templo"
    );
    const specialOfferId = createSpecialOfferResponse.body.specialOffer.id;

    const createTitheResponse = await request(app)
      .post("/tithe")
      .set("Authorization", `Bearer ${treasurerToken}`)
      .send({
        id_church: churchId,
        id_member: memberId,
        id_treasurer: treasurerId,
        value: 300,
        reason: "Dizimo mensal",
        date: "2024-05-21",
        month: 5,
        year: 2024,
      });

    expect(createTitheResponse.status).toBe(200);
    expect(createTitheResponse.body.tithe.month).toBe(5);
    const titheId = createTitheResponse.body.tithe.id;

    const updateCostResponse = await request(app)
      .put(`/cost/${costId}`)
      .set("Authorization", `Bearer ${treasurerToken}`)
      .send({
        value: 510.75,
        date: "2024-05-22",
        description: "Som, cabos e manutencao",
      });

    expect(updateCostResponse.status).toBe(200);
    expect(updateCostResponse.body.cost.description).toBe(
      "Som, cabos e manutencao"
    );

    const updateOfferResponse = await request(app)
      .put(`/offer/${offerId}`)
      .set("Authorization", `Bearer ${treasurerToken}`)
      .send({
        id_treasurer: treasurerId,
        value: 980,
      });

    expect(updateOfferResponse.status).toBe(200);
    expect(updateOfferResponse.body.offer.value).toBe(980);

    const updateSpecialOfferResponse = await request(app)
      .put(`/specialOffer/${specialOfferId}`)
      .set("Authorization", `Bearer ${treasurerToken}`)
      .send({
        id_church: churchId,
        id_member: memberId,
        id_treasurer: treasurerId,
        value: 1350,
        reason: "Reforma do templo principal",
        date: "2024-05-23",
      });

    expect(updateSpecialOfferResponse.status).toBe(200);
    expect(updateSpecialOfferResponse.body.specialOffer.reason).toBe(
      "Reforma do templo principal"
    );

    const updateTitheResponse = await request(app)
      .put(`/tithe/${titheId}`)
      .set("Authorization", `Bearer ${treasurerToken}`)
      .send({
        id_church: churchId,
        id_member: memberId,
        id_treasurer: treasurerId,
        value: 320,
        reason: "Dizimo mensal atualizado",
        date: "2024-05-24",
        month: 6,
        year: 2024,
      });

    expect(updateTitheResponse.status).toBe(200);
    expect(updateTitheResponse.body.tithe.month).toBe(6);

    const deleteCostResponse = await request(app)
      .delete(`/cost/${costId}`)
      .set("Authorization", `Bearer ${treasurerToken}`);

    expect(deleteCostResponse.status).toBe(204);

    const [costsResponse, offersResponse, specialOffersResponse, tithesResponse] =
      await Promise.all([
        request(app)
          .get("/cost")
          .set("Authorization", `Bearer ${treasurerToken}`),
        request(app)
          .get("/offer")
          .set("Authorization", `Bearer ${treasurerToken}`),
        request(app)
          .get("/specialOffer")
          .set("Authorization", `Bearer ${treasurerToken}`),
        request(app)
          .get("/tithe")
          .set("Authorization", `Bearer ${treasurerToken}`),
      ]);

    expect(costsResponse.status).toBe(200);
    expect(costsResponse.body.costs).toHaveLength(0);
    expect(offersResponse.status).toBe(200);
    expect(offersResponse.body.offers).toHaveLength(3);
    expect(offersResponse.body.offers.find((offer: { id: number }) => offer.id === offerId)?.value).toBe(980);
    expect(specialOffersResponse.status).toBe(200);
    expect(specialOffersResponse.body.specialOffers).toHaveLength(2);
    expect(
      specialOffersResponse.body.specialOffers.find(
        (specialOffer: { id: number }) => specialOffer.id === specialOfferId
      )?.reason
    ).toBe("Reforma do templo principal");
    expect(tithesResponse.status).toBe(200);
    expect(tithesResponse.body.tithes).toHaveLength(1);
    expect(tithesResponse.body.tithes[0].month).toBe(6);
  });
});
