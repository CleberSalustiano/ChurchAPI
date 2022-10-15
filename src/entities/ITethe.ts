import { ISpecialOffer } from "./ISpecialOffer";

export interface ITethe {
  id: number;
  month: number;
  year: number;
  id_special_offer: number;
  specialOffer?: ISpecialOffer;
}