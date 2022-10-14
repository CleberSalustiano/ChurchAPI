import { IOffer } from "../../../entities/IOffer";
import { ICreateOfferDTO } from "../dtos/ICreateOfferDTO";

export interface IOfferRepository {
  create(data: ICreateOfferDTO): Promise<IOffer | undefined>;
  findById(id_offer: number): Promise<IOffer | undefined>;
  findAll(): Promise<IOffer[] | undefined>;
}
