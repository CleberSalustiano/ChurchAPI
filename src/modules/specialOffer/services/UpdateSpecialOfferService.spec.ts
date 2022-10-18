import DateError from "../../../shared/errors/DateError";
import NoExistError from "../../../shared/errors/NoExistError";
import FakeOfferRepository from "../../../shared/modules/offer/repositories/fakes/FakeOfferRepository";
import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeTreasurerRepository from "../../treasurer/repositories/fakes/FakeTreasurerRepository";
import FakeSpecialOfferRepository from "../repositories/fakes/FakeSpecialOfferRepository";
import UpdateSpecialOfferService from "./UpdateSpecialOfferService";

describe("Update a special offer", () => {
  it("should be able to update a special offer", async () => {
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const offerRepository = new FakeOfferRepository();
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const treasurerRepository = new FakeTreasurerRepository();

    const updateSpecialOffer = new UpdateSpecialOfferService(
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
    churchRepository.create({ date: "1923-12-24", id_location: 1 });
    offerRepository.create({ id_treasurer: 0, value: 300 });

    specialOfferRepository.create({
      date: "2016-08-09",
      id_church: 0,
      id_member: 1,
      id_offer: 0,
      reason: "Ofertas recebidas",
    });

    const newSpecialOffer = await updateSpecialOffer.execute({
      date: "2016-08-09",
      id_church: 1,
      id_member: 0,
      value: 400,
      id_special_offer: 0,
      id_treasurer: 0,
      reason: "Ofertas recebidas ",
    });

    const offer = await offerRepository.findById(newSpecialOffer.id_offer);

    expect(newSpecialOffer).toBeTruthy();
    expect(offer?.value).toBe(400);
  });

  it("should not be able to update a special offer that doesn't exist", async () => {
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const offerRepository = new FakeOfferRepository();
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const treasurerRepository = new FakeTreasurerRepository();

    const updateSpecialOffer = new UpdateSpecialOfferService(
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
    churchRepository.create({ date: "1923-12-24", id_location: 1 });
    offerRepository.create({ id_treasurer: 0, value: 300 });

    expect(
      updateSpecialOffer.execute({
        date: "2016-08-09",
        id_church: 1,
        id_member: 0,
        value: 400,
        id_special_offer: 0,
        id_treasurer: 0,
        reason: "Ofertas recebidas ",
      })
    ).rejects.toThrowError(NoExistError);
  });

  it("should not be able to update a special offer with incorrect date", () => {
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const offerRepository = new FakeOfferRepository();
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const treasurerRepository = new FakeTreasurerRepository();

    const updateSpecialOffer = new UpdateSpecialOfferService(
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
    churchRepository.create({ date: "1923-12-24", id_location: 1 });
    offerRepository.create({ id_treasurer: 0, value: 300 });

    specialOfferRepository.create({
      date: "2016-08-09",
      id_church: 0,
      id_member: 1,
      id_offer: 0,
      reason: "Ofertas recebidas",
    });

    expect(
      updateSpecialOffer.execute({
        date: "201608-09",
        id_church: 1,
        id_member: 0,
        value: 400,
        id_special_offer: 0,
        id_treasurer: 0,
        reason: "Ofertas recebidas ",
      })
    ).rejects.toThrowError(DateError);
  });

  it("should not be able to update a special offer than church doesn't exist", () => {
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const offerRepository = new FakeOfferRepository();
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const treasurerRepository = new FakeTreasurerRepository();

    const updateSpecialOffer = new UpdateSpecialOfferService(
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
    offerRepository.create({ id_treasurer: 0, value: 300 });

    specialOfferRepository.create({
      date: "2016-08-09",
      id_church: 0,
      id_member: 1,
      id_offer: 0,
      reason: "Ofertas recebidas",
    });

    expect(
      updateSpecialOffer.execute({
        date: "2016-08-09",
        id_church: 1,
        id_member: 0,
        value: 400,
        id_special_offer: 0,
        id_treasurer: 0,
        reason: "Ofertas recebidas ",
      })
    ).rejects.toThrowError(NoExistError);
  });
  it("should not be able to update a special offer than member doesn't exist", () => {
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const offerRepository = new FakeOfferRepository();
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const treasurerRepository = new FakeTreasurerRepository();

    const updateSpecialOffer = new UpdateSpecialOfferService(
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
    churchRepository.create({ date: "1923-12-24", id_location: 1 });
    offerRepository.create({ id_treasurer: 0, value: 300 });

    specialOfferRepository.create({
      date: "2016-08-09",
      id_church: 0,
      id_member: 0,
      id_offer: 0,
      reason: "Ofertas recebidas",
    });

    expect(
      updateSpecialOffer.execute({
        date: "2016-08-09",
        id_church: 1,
        id_member: 1,
        value: 400,
        id_special_offer: 0,
        id_treasurer: 0,
        reason: "Ofertas recebidas ",
      })
    ).rejects.toThrowError(NoExistError);
  });

  it("should not be able to update a special offer than treasurer doesn't exist", () => {
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const offerRepository = new FakeOfferRepository();
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const treasurerRepository = new FakeTreasurerRepository();

    const updateSpecialOffer = new UpdateSpecialOfferService(
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

    churchRepository.create({ date: "1923-12-25", id_location: 0 });
    churchRepository.create({ date: "1923-12-24", id_location: 1 });
    offerRepository.create({ id_treasurer: 0, value: 300 });

    specialOfferRepository.create({
      date: "2016-08-09",
      id_church: 0,
      id_member: 1,
      id_offer: 0,
      reason: "Ofertas recebidas",
    });

    expect(
      updateSpecialOffer.execute({
        date: "2016-08-09",
        id_church: 1,
        id_member: 0,
        value: 400,
        id_special_offer: 0,
        id_treasurer: 0,
        reason: "Ofertas recebidas ",
      })
    ).toBeTruthy();
  });
});
