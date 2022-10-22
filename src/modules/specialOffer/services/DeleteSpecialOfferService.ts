import NoExistError from "../../../shared/errors/NoExistError";
import { IOfferRepository } from "../../../shared/modules/offer/repositories/IOfferRepository";
import DeleteOfferService from "../../../shared/modules/offer/services/DeleteOfferService";
import { ISpecialOfferRepository } from "../repositories/ISpecialOfferRepository";

export default class DeleteSpecialOfferService {
  constructor(
    private specialOfferRepository: ISpecialOfferRepository,
    private offerRepository: IOfferRepository
  ) {
    this.specialOfferRepository = specialOfferRepository;
    this.offerRepository = offerRepository;
  }

  async execute(id_special_offer: number) {

    const deleteOffer = new DeleteOfferService(this.offerRepository)

    const specialOffer = await this.specialOfferRepository.findById(
      id_special_offer
    );

    if (!specialOffer) throw new NoExistError("special offer");

    const isSpecialOfferDeleted = await this.specialOfferRepository.delete(
      id_special_offer
    );

    if (!isSpecialOfferDeleted) throw new Error("The special offer doesn't deleted");

    await deleteOffer.execute(specialOffer.id_offer);

    return specialOffer;
  }
}
