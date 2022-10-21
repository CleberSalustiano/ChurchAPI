import FakeOfferRepository from "../../../shared/modules/offer/repositories/fakes/FakeOfferRepository";
import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeSpecialOfferRepository from "../../specialOffer/repositories/fakes/FakeSpecialOfferRepository";
import FakeTreasurerRepository from "../../treasurer/repositories/fakes/FakeTreasurerRepository";
import FakeTetheRepository from "../repositories/fakes/FakeTetheRepository";
import UpdateTetheService from "./UpdateTetheService";

describe("Update a Tethe Service", () => {
  it("should be able to update a tethe", async () => {
    const offerRepository = new FakeOfferRepository();
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const tetheRepository = new FakeTetheRepository();
    const treasurerRepository = new FakeTreasurerRepository();
    const churchRepository = new FakeChurchRepository();
    const memberRepository = new FakeMemberRepository();

    const updateTethe = new UpdateTetheService(
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

    offerRepository.create({ id_treasurer: 0, value: 250 });

    churchRepository.create({ date: "1923-12-25", id_location: 0 });

    specialOfferRepository.create({
      date: "2014-12-30",
      id_church: 0,
      id_member: 1,
      reason: "Old",
      id_offer: 0,
    });

    tetheRepository.create({ id_special_offer: 0, month: 12, year: 2014 });

    const tethe = await updateTethe.execute({
      date: "2015-12-30",
      id_church: 0,
      id_member: 1,
      month: 4,
      reason: "Aoba",
      year: 2015,
      id_treasurer: 0,
      value: 300,
      id_tethe: 0,
    });

    expect(tethe).toBeTruthy();
    expect(tethe.month).toBe(4);
    expect(tethe.id).toBe(0);
  });
});
