import NoExistError from "../../../shared/errors/NoExistError";
import FakeOfferRepository from "../../../shared/modules/offer/repositories/fakes/FakeOfferRepository";
import FakeSpecialOfferRepository from "../repositories/fakes/FakeSpecialOfferRepository";
import DeleteSpecialOfferService from "./DeleteSpecialOfferService";

describe("Delete Special Offer", () => {
  it("should be able to delete a special offer", async () => {
    const offerRepository = new FakeOfferRepository();
    const specialOfferRepository = new FakeSpecialOfferRepository();

    const deleteSpecialOffer = new DeleteSpecialOfferService(
      specialOfferRepository,
      offerRepository
    );

    offerRepository.create({ id_treasurer: 0, value: 250 });
    specialOfferRepository.create({
      date: "1999-20-12",
      id_church: 0,
      id_member: 0,
      id_offer: 0,
      reason: "Aoba",
    });

    const specialOfferDeleted = await deleteSpecialOffer.execute(0);

    expect(specialOfferDeleted).toBeTruthy();
  });

  it("should not be able to delete a special offer that doesn't exist", async () => {
    const offerRepository = new FakeOfferRepository();
    const specialOfferRepository = new FakeSpecialOfferRepository();

    const deleteSpecialOffer = new DeleteSpecialOfferService(
      specialOfferRepository,
      offerRepository
    );

    offerRepository.create({ id_treasurer: 0, value: 250 });

    expect(deleteSpecialOffer.execute(0)).rejects.toThrowError(NoExistError);
  })
});
