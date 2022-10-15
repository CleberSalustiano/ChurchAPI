import NoExistError from "../../../shared/errors/NoExistError";
import FakeTreasurerRepository from "../../treasurer/repositories/fakes/FakeTreasurerRepository";
import FakeOfferRepository from "../repositories/fakes/FakeOfferRepository";
import UpdateOfferService from "./UpdateOfferService";

describe("Update a offer", () => {
  it("should be able to update a offer", async () => {
    const treasurerRepository = new FakeTreasurerRepository();
    const offerRepository = new FakeOfferRepository();

    const updateOffer = new UpdateOfferService(
      offerRepository,
      treasurerRepository
    );

    treasurerRepository.create(0);
    treasurerRepository.create(1);

    offerRepository.create({ id_treasurer: 0, value: 250 });

    const offer = await updateOffer.execute({
      id_offer: 0,
      id_treasurer: 1,
      value: 1000,
    });

    expect(offer).toBeTruthy();
    expect(offer?.value).toBe(1000);
    expect(offer?.id_treasurer).toBe(1);
  });

  it("should not be able to update a offer that doesn't exist", () => {
    const treasurerRepository = new FakeTreasurerRepository();
    const offerRepository = new FakeOfferRepository();

    const updateOffer = new UpdateOfferService(
      offerRepository,
      treasurerRepository
    );

    treasurerRepository.create(0);
    treasurerRepository.create(1);

    expect(
      updateOffer.execute({
        id_offer: 0,
        id_treasurer: 1,
        value: 1000,
      })
    ).rejects.toThrowError(NoExistError);
  });
  it("should not be able to update a offer that treasurer doesn't existI", () => {
    const treasurerRepository = new FakeTreasurerRepository();
    const offerRepository = new FakeOfferRepository();

    const updateOffer = new UpdateOfferService(
      offerRepository,
      treasurerRepository
    );

    treasurerRepository.create(0);

    offerRepository.create({ id_treasurer: 0, value: 250 });

    expect(
      updateOffer.execute({
        id_offer: 0,
        id_treasurer: 1,
        value: 1000,
      })
    ).rejects.toThrowError(NoExistError);
  });
});
