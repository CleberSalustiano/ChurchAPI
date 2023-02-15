import { ISpecialOffer } from "../../../entities/ISpecialOffer";
import { ICreateSpecialOfferDTO } from "../dtos/ICreateSpecialOfferDTO";
import { IUpdateSpecialOfferDTO } from "../dtos/IUpdateSpecialOfferDTO";

export interface ISpecialOfferRepository {
  create(data: ICreateSpecialOfferDTO): Promise<ISpecialOffer | undefined>;
  findById(id_special_offer: number): Promise<ISpecialOffer | null>;
  findAll(): Promise<ISpecialOffer[] | undefined>;
  update(data: IUpdateSpecialOfferDTO): Promise<ISpecialOffer | undefined>;
  delete(id_special_offer: number): Promise<boolean>;
}
