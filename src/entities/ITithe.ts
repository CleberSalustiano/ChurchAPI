import { ISpecialOffer } from "./ISpecialOffer";

export interface ITithe {
  id: number;
  month: number;
  year: number;
  id_special_offer: number;
  specialOffer?: ISpecialOffer;
}
