import { IChurch } from "./IChurch";
import { IOffer } from "./IOffer";

export interface ICult {
  date: Date;
  theme: String;
  church: IChurch;
  offer: IOffer[];
}