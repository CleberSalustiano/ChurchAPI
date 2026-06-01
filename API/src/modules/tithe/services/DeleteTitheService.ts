import NoExistError from "../../../shared/errors/NoExistError";
import { IOfferRepository } from "../../../shared/modules/offer/repositories/IOfferRepository";
import { ISpecialOfferRepository } from "../../specialOffer/repositories/ISpecialOfferRepository";
import DeleteSpecialOfferService from "../../specialOffer/services/DeleteSpecialOfferService";
import { ITitheRepository } from "../repositories/ITitheRepository";

export default class DeleteTitheService {
  constructor(private offerRepository: IOfferRepository,private titheRepository: ITitheRepository, private specialOfferRepository: ISpecialOfferRepository) {
    this.specialOfferRepository = specialOfferRepository;
    this.titheRepository = titheRepository;
    this.offerRepository = offerRepository;
  }

  async execute(id_tithe: number) {

    const deleteSpecialOffer = new DeleteSpecialOfferService(this.specialOfferRepository, this.offerRepository);

    const tithe = await this.titheRepository.findById(id_tithe);

    if(!tithe) throw new NoExistError("Tithe");

    const isTitheDeleted = await this.titheRepository.delete(id_tithe);

    if (!isTitheDeleted) throw new Error("This tithe was not deleted");

    await deleteSpecialOffer.execute(tithe.id_special_offer);

    return isTitheDeleted;
  }
}
