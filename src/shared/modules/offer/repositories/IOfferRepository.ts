import { IOffer } from "../../../../entities/IOffer";
import { ICreateOfferDTO } from "../dtos/ICreateOfferDTO";
import { IUpdateOfferDTO } from "../dtos/IUpdateOfferDTO";

export interface IOfferRepository {
  create(data: ICreateOfferDTO): Promise<IOffer | undefined>;
  findById(id_offer: number): Promise<IOffer | undefined>;
  findAll(): Promise<IOffer[] | undefined>;
  update(data: IUpdateOfferDTO): Promise<IOffer | undefined>;
  delete(id_offer: number): Promise<IOffer | undefined>;
}
