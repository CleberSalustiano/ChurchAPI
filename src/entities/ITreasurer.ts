import { IMember } from "./IMember"
import { IOffer } from "./IOffer";

export interface ITreasure extends IMember {
  startDate: Date;
  endDate: Date;
  offer: IOffer[];
}