import { ICult } from "./ICult";
import { IOffer } from "./IOffer";

export interface ICultOffer {
  id_cult: number;
  cult?: ICult;
  id_offer: IOffer;
}
