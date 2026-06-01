import NoExistError from "../../../errors/NoExistError";
import FakeOfferRepository from "../repositories/fakes/FakeOfferRepository";
import DeleteOfferService from "./DeleteOfferService";

describe("Delete a offer", () => {
  it("should be able to delete a offer", async () => {
    const offerRepository = new FakeOfferRepository();

    const deleteOffer = new DeleteOfferService(offerRepository);

    offerRepository.create({ id_treasurer: 0, value: 250 });
    offerRepository.create({ id_treasurer: 0, value: 450 });

    const offerDeleted = await deleteOffer.execute(1);
    const hiddenOffer = await offerRepository.findById(1);

    expect(offerDeleted).toBeTruthy();
    expect(offerDeleted.value).toBe(450);
    expect(hiddenOffer).toBeUndefined();
  });

  it("should not be able to delete a offer that doesn't exist", () => {
    const offerRepository = new FakeOfferRepository();

    const deleteOffer = new DeleteOfferService(offerRepository);

    offerRepository.create({ id_treasurer: 0, value: 250 });

    expect(deleteOffer.execute(1)).rejects.toThrowError(NoExistError);
  });
});
