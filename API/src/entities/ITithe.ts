import { ISpecialOffer } from "./ISpecialOffer";

export interface ITithe {
  id: number;
  month: number;
  year: number;
  deletedAt?: Date | null;
  id_special_offer: number;
  specialOffer?: ISpecialOffer;
}
