import FakeOfferRepository from "../../../shared/modules/offer/repositories/fakes/FakeOfferRepository";
import FakeSpecialOfferRepository from "../../specialOffer/repositories/fakes/FakeSpecialOfferRepository";
import FakeTitheRepository from "../repositories/fakes/FakeTitheRepository";
import DeleteTitheService from "./DeleteTitheService";

describe("Delete tithe", () => {
  it("should be able to delete a tithe", async () => {
    const offerRepository = new FakeOfferRepository();
    const specialOfferRepository = new FakeSpecialOfferRepository();
    const titheRepository = new FakeTitheRepository();

    const deleteTithe = new DeleteTitheService(
      offerRepository,
      titheRepository,
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
    titheRepository.create({ id_special_offer: 0, month: 5, year: 2014 });

    const isTitheDeleted = await deleteTithe.execute(0);

    expect(isTitheDeleted).toBe(true);
  });
});
