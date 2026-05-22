import NoExistError from "../../../shared/errors/NoExistError";
import FakeOfferRepository from "../../../shared/modules/offer/repositories/fakes/FakeOfferRepository";
import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeSpecialOfferRepository from "../../specialOffer/repositories/fakes/FakeSpecialOfferRepository";
import FakeTreasurerRepository from "../../treasurer/repositories/fakes/FakeTreasurerRepository";
import FakeTitheRepository from "../repositories/fakes/FakeTitheRepository";
import UpdateTitheService from "./UpdateTitheService";

describe("Update a Tithe Service", () => {
  it("should be able to update a tithe", async () => {
    const offerRepository = new FakeOfferRepository();
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const titheRepository = new FakeTitheRepository();
    const treasurerRepository = new FakeTreasurerRepository();
    const churchRepository = new FakeChurchRepository();
    const memberRepository = new FakeMemberRepository();

    const updateTithe = new UpdateTitheService(
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
      titleChurch: "Title",
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
      titleChurch: "Title",
      id_user: 1,
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

    titheRepository.create({ id_special_offer: 0, month: 12, year: 2014 });

    const tithe = await updateTithe.execute({
      date: "2015-12-30",
      id_church: 0,
      id_member: 1,
      month: 4,
      reason: "Aoba",
      year: 2015,
      id_treasurer: 0,
      value: 300,
      id_tithe: 0,
    });

    expect(tithe).toBeTruthy();
    expect(tithe.month).toBe(4);
    expect(tithe.id).toBe(0);
  });

  it("should not be able to update a tithe that doesn't exist", () => {
    const offerRepository = new FakeOfferRepository();
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const titheRepository = new FakeTitheRepository();
    const treasurerRepository = new FakeTreasurerRepository();
    const churchRepository = new FakeChurchRepository();
    const memberRepository = new FakeMemberRepository();

    const updateTithe = new UpdateTitheService(
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
      titleChurch: "Title",
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
      titleChurch: "Title",
      id_user: 1,
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

    expect(updateTithe.execute({
      date: "2015-12-30",
      id_church: 0,
      id_member: 1,
      month: 4,
      reason: "Aoba",
      year: 2015,
      id_treasurer: 0,
      value: 300,
      id_tithe: 0,
    })).rejects.toThrowError(NoExistError)
  })
});
