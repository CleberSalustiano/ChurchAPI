import FakeOfferRepository from "../../../shared/modules/offer/repositories/fakes/FakeOfferRepository";
import FakeChurchRepository from "../../churches/repositories/fakes/FakeChurchRepository";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeSpecialOfferRepository from "../../specialOffer/repositories/fakes/FakeSpecialOfferRepository";
import FakeTreasurerRepository from "../../treasurer/repositories/fakes/FakeTreasurerRepository";
import FakeTitheRepository from "../repositories/fakes/FakeTitheRepository";
import CreateNewTitheService from "./CreateNewTitheService";

describe("Create a tithe", () => {
  it("should be able to create a tithe", async () => {
    const offerRepository = new FakeOfferRepository();
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const titheRepository = new FakeTitheRepository();
    const treasurerRepository = new FakeTreasurerRepository();
    const churchRepository = new FakeChurchRepository();
    const memberRepository = new FakeMemberRepository();

    const createNewTithe = new CreateNewTitheService(
      offerRepository,
      specialOfferRepository,
      titheRepository,
      treasurerRepository,
      churchRepository,
      memberRepository
    );
    
    memberRepository.create({
      batism_date: "1999-12-12",
      birth_date: "1999-12-13",
      cpf: BigInt(12312312323),
      email: "bdegamer@email.com",
      id_church: 0,
      name: "Carlos",
      rg: 123233,
      ecclesiasticalRole: "Title",
      id_user: 0,
    });

    memberRepository.create({
      batism_date: "1999-12-12",
      birth_date: "1999-12-13",
      cpf: BigInt(12312312323),
      email: "bdegamer@email.com",
      id_church: 0,
      name: "Jordan",
      rg: 123233,
      ecclesiasticalRole: "Title",
      id_user: 1,
    });

    treasurerRepository.create(0);

    churchRepository.create({ date: "1923-12-25", id_location: 0 });
    
    const tithe = await createNewTithe.execute({date: "2015-12-30", id_church: 0, id_member: 1, month: 4, reason: "Aoba", year: 2015, id_treasurer: 0, value: 300});

    expect(tithe).toBeTruthy();
    expect(tithe.month).toBe(4);
    expect(tithe.year).toBe(2015);
  });
});
