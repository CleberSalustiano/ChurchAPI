import FakeOfferRepository from "../../../shared/modules/offer/repositories/fakes/FakeOfferRepository";
import FakeSpecialOfferRepository from "../../specialOffer/repositories/fakes/FakeSpecialOfferRepository";
import FakeTetheRepository from "../repositories/fakes/FakeTetheRepository";
import DeleteTetheService from "./DeleteTetheService";

describe("Delete tethe", () => {
  it("should be able to delete a tethe", async () => {
    const offerRepository = new FakeOfferRepository();
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const tetheRepository = new FakeTetheRepository();

    const deleteTethe = new DeleteTetheService(
      offerRepository,
      tetheRepository,
      specialOfferRepository
    );

    offerRepository.create({ id_treasurer: 0, value: 250 });
    specialOfferRepository.create({
      date: "1999-12-12",
      id_member: 0,
      reason: "asd",
      id_church: 0,
      id_offer: 0,
    });
    tetheRepository.create({ id_special_offer: 0, month: 5, year: 2014 });

    const isTetheDeleted = await deleteTethe.execute(0);

    expect(isTetheDeleted).toBe(true);
  });
});
