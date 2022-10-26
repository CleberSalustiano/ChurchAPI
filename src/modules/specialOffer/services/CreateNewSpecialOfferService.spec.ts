import DateError from "../../../shared/errors/DateError";
import NoExistError from "../../../shared/errors/NoExistError";
import FakeOfferRepository from "../../../shared/modules/offer/repositories/fakes/FakeOfferRepository";
import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeTreasurerRepository from "../../treasurer/repositories/fakes/FakeTreasurerRepository";
import FakeSpecialOfferRepository from "../repositories/fakes/FakeSpecialOfferRepository";
import CreateNewSpecialOfferService from "./CreateNewSpecialOfferService";

describe("Create a new Special Offer", () => {
  it("should be able to create a new SpecialOffer", async () => {
    const offerRepository = new FakeOfferRepository();
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const memberRepository = new FakeMemberRepository();
    const treasurerRepository = new FakeTreasurerRepository();
    const churchRepository = new FakeChurchRepository();

    const createNewSpecialOffer = new CreateNewSpecialOfferService(
      offerRepository,
      specialOfferRepository,
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
      id_user: 0
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
      id_user: 0
    });

    treasurerRepository.create(0);

    churchRepository.create({ date: "1923-12-25", id_location: 0 });

    const specialOffer = await createNewSpecialOffer.execute({
      date: "2016-08-09",
      id_church: 0,
      id_member: 1,
      id_treasurer: 0,
      reason: "Ofertas recebidas",
      value: 1200,
    });

    expect(specialOffer).toBeTruthy();
    expect(specialOffer.id_offer).toBe(0);
  });

  it("should not be able to create a new special offer with incorrect date", async () => {
    const offerRepository = new FakeOfferRepository();
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const memberRepository = new FakeMemberRepository();
    const treasurerRepository = new FakeTreasurerRepository();
    const churchRepository = new FakeChurchRepository();

    const createNewSpecialOffer = new CreateNewSpecialOfferService(
      offerRepository,
      specialOfferRepository,
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
      id_user: 0
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
      id_user: 0
    });

    treasurerRepository.create(0);

    churchRepository.create({ date: "1923-12-25", id_location: 0 });

    expect(
      createNewSpecialOffer.execute({
        date: "201608-09",
        id_church: 0,
        id_member: 1,
        id_treasurer: 0,
        reason: "Ofertas recebidas",
        value: 1200,
      })
    ).rejects.toThrowError(DateError);
  });

  it("should not be able to create a special offer then member doesn't exist", async () => {
    const offerRepository = new FakeOfferRepository();
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const memberRepository = new FakeMemberRepository();
    const treasurerRepository = new FakeTreasurerRepository();
    const churchRepository = new FakeChurchRepository();

    const createNewSpecialOffer = new CreateNewSpecialOfferService(
      offerRepository,
      specialOfferRepository,
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
      id_user: 0
    });

    treasurerRepository.create(0);

    churchRepository.create({ date: "1923-12-25", id_location: 0 });

    expect(
      createNewSpecialOffer.execute({
        date: "2016-08-09",
        id_church: 0,
        id_member: 1,
        id_treasurer: 0,
        reason: "Ofertas recebidas",
        value: 1200,
      })
    ).rejects.toThrowError(NoExistError);
  });

  it("should not be able to create a new special offer than church doesn't exist", async () => {
    const offerRepository = new FakeOfferRepository();
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const memberRepository = new FakeMemberRepository();
    const treasurerRepository = new FakeTreasurerRepository();
    const churchRepository = new FakeChurchRepository();

    const createNewSpecialOffer = new CreateNewSpecialOfferService(
      offerRepository,
      specialOfferRepository,
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
      id_user: 0
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
      id_user: 0
    });

    treasurerRepository.create(0);

    expect(
      createNewSpecialOffer.execute({
        date: "2016-08-09",
        id_church: 0,
        id_member: 1,
        id_treasurer: 0,
        reason: "Ofertas recebidas",
        value: 1200,
      })
    ).rejects.toThrowError(NoExistError);
  });
});
