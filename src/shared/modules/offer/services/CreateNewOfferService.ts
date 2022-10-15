
import { ITreasurerRepository } from "../../../../modules/treasurer/repositories/ITreasurerRepository";
import NoExistError from "../../../errors/NoExistError";
import { ICreateOfferDTO } from "../dtos/ICreateOfferDTO";
import { IOfferRepository } from "../repositories/IOfferRepository";

export default class CreateNewOfferService {
  constructor(
    private offerRepository: IOfferRepository,
    private treasurerRepository: ITreasurerRepository
  ) {
    this.offerRepository = offerRepository;
    this.treasurerRepository = treasurerRepository;
  }

  async execute(dataOffer: ICreateOfferDTO) {
    const treasurer = await this.treasurerRepository.findById(
      dataOffer.id_treasurer
    );

    if (!treasurer) throw new NoExistError("treasurer");

    const offer = await this.offerRepository.create(dataOffer);

    if (!offer) throw new Error("This offer wasn't created");

    return offer;
  }
}
