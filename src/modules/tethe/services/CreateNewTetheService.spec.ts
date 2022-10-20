import FakeOfferRepository from "../../../shared/modules/offer/repositories/fakes/FakeOfferRepository";
import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeSpecialOfferRepository from "../../specialOffer/repositories/fakes/FakeSpecialOfferRepository";
import FakeTreasurerRepository from "../../treasurer/repositories/fakes/FakeTreasurerRepository";
import FakeTetheRepository from "../repositories/fakes/FakeTetheRepository";
import CreateNewTetheService from "./CreateNewTetheService";

describe("Create a tethe", () => {
  it("should be able to create a tethe", async () => {
    const offerRepository = new FakeOfferRepository();
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const tetheRepository = new FakeTetheRepository();
    const treasurerRepository = new FakeTreasurerRepository();
    const churchRepository = new FakeChurchRepository();
    const memberRepository = new FakeMemberRepository();

    const createNewTethe = new CreateNewTetheService(
      offerRepository,
      specialOfferRepository,
      tetheRepository,
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
      login: "aoba",
      name: "Carlos",
      password: "Cleber",
      rg: 123233,
      titleChurch: "Title",
    });

    memberRepository.create({
      batism_date: "1999-12-12",
      birth_date: "1999-12-13",
      cpf: BigInt(12312312323),
      email: "bdegamer@email.com",
      id_church: 0,
      login: "aoba",
      name: "Jordan",
      password: "Cleber",
      rg: 123233,
      titleChurch: "Title",
    });

    treasurerRepository.create(0);

    churchRepository.create({ date: "1923-12-25", id_location: 0 });
    
    const tethe = await createNewTethe.execute({date: "2015-12-30", id_church: 0, id_member: 1, month: 4, reason: "Aoba", year: 2015, id_treasurer: 0, value: 300});

    expect(tethe).toBeTruthy();
    expect(tethe.month).toBe(4);
    expect(tethe.year).toBe(2015);
  });
});
