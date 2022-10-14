import { ICreateOfferDTO } from "../dtos/ICreateOfferDTO";
import { IOfferRepository } from "../repositories/IOfferRepository";

export default class CreateNewOfferService {
  constructor(private offerRepository : IOfferRepository) {
    this.offerRepository = offerRepository;
  }

  async execute({id_treasurer, value} : ICreateOfferDTO) {

  }
}