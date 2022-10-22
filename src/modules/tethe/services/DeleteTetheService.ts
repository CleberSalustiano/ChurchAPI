import NoExistError from "../../../shared/errors/NoExistError";
import { IOfferRepository } from "../../../shared/modules/offer/repositories/IOfferRepository";
import { ISpecialOfferRepository } from "../../specialOffer/repositories/ISpecialOfferRepository";
import DeleteSpecialOfferService from "../../specialOffer/services/DeleteSpecialOfferService";
import { ITetheRepository } from "../repositories/ITetheRepository";

export default class DeleteTetheService {
  constructor(private offerRepository: IOfferRepository,private tetheRepository: ITetheRepository, private specialOfferRepository: ISpecialOfferRepository) {
    this.specialOfferRepository = specialOfferRepository;
    this.tetheRepository = tetheRepository;
    this.offerRepository = offerRepository;
  }

  async execute(id_tethe: number) {

    const deleteSpecialOffer = new DeleteSpecialOfferService(this.specialOfferRepository, this.offerRepository);

    const tethe = await this.tetheRepository.findById(id_tethe);

    if(!tethe) throw new NoExistError("Tethe");

    const isTetheDeleted = await this.tetheRepository.delete(id_tethe);

    if (!isTetheDeleted) throw new Error("This tethe doesn't deleted");

    await deleteSpecialOffer.execute(tethe.id_special_offer);

    return isTetheDeleted;
  }
}