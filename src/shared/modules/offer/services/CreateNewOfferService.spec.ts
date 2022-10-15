
import FakeTreasurerRepository from "../../../../modules/treasurer/repositories/fakes/FakeTreasurerRepository";
import NoExistError from "../../../errors/NoExistError";
import FakeOfferRepository from "../repositories/fakes/FakeOfferRepository";
import CreateNewOfferService from "./CreateNewOfferService";

describe("Create new offer", () => {
  it("should be able to create a new offer", async () => {
    const offerRepository = new FakeOfferRepository();
    const treasurerRepository = new FakeTreasurerRepository();

    const createNewOffer = new CreateNewOfferService(
      offerRepository,
      treasurerRepository
    );

    treasurerRepository.create(0);

    const offer = await createNewOffer.execute({ id_treasurer: 0, value: 250 });

    expect(offer).toBeTruthy();
    expect(offer.value).toBe(250);
  });

  it("should not be able to create a offer that treasurer doesn't exist", () => {
    const offerRepository = new FakeOfferRepository();
    const treasurerRepository = new FakeTreasurerRepository();

    const createNewOffer = new CreateNewOfferService(
      offerRepository,
      treasurerRepository
    );

    expect(
      createNewOffer.execute({ id_treasurer: 0, value: 250 })
    ).rejects.toThrowError(NoExistError);
  });
});
