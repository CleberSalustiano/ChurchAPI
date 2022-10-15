
import { ITreasurerRepository } from "../../../../modules/treasurer/repositories/ITreasurerRepository";
import NoExistError from "../../../errors/NoExistError";
import { IUpdateOfferDTO } from "../dtos/IUpdateOfferDTO";
import { IOfferRepository } from "../repositories/IOfferRepository";

export default class UpdateOfferService {
  constructor(
    private offerRepository: IOfferRepository,
    private treasurerRepository: ITreasurerRepository
  ) {
    this.offerRepository = offerRepository;
    this.treasurerRepository = treasurerRepository;
  }

  async execute(dataOffer: IUpdateOfferDTO) {
    const treasurer = await this.treasurerRepository.findById(
      dataOffer.id_treasurer
    );

    if (!treasurer) throw new NoExistError("treasurer");

    const offer = await this.offerRepository.findById(dataOffer.id_offer);

    if (!offer) throw new NoExistError("offer");

    const offerUpdated = await this.offerRepository.update(dataOffer);

    return offerUpdated;
  }
}
