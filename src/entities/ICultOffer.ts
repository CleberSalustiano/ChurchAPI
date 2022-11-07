import { ICult } from "./ICult";
import { IOffer } from "./IOffer";

export interface ICultOffer {
  id: number;
  id_cult: number;
  cult?: ICult;
  id_offer: IOffer;
}
