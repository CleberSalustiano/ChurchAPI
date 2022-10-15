import { ISpecialOffer } from "../../../entities/ISpecialOffer";
import { ICreateSpecialOfferDTO } from "../dtos/ICreateSpecialOfferDTO";

export interface ISpecialOfferRepository {
  create(data: ICreateSpecialOfferDTO): Promise<ISpecialOffer | undefined>;
  findById(id_special_offer: number): Promise<ISpecialOffer | undefined>;
  findAll(): Promise<ISpecialOffer[] | undefined>;
}
