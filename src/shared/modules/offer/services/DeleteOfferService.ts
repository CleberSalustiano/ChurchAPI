import NoExistError from "../../../errors/NoExistError";
import { IOfferRepository } from "../repositories/IOfferRepository";

export default class DeleteOfferService {
  constructor(private offerRepository: IOfferRepository) {
    this.offerRepository = offerRepository;
  }

  async execute(id_offer: number) {
    const offer = await this.offerRepository.findById(id_offer);

    if (!offer) throw new NoExistError("offer");

    await this.offerRepository.delete(id_offer);

    return offer;
  }
}
