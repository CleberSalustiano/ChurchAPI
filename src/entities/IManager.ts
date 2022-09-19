import { IChurch } from "./IChurch";
import { IMember } from "./IMember";

export interface IManager extends IMember {
  startDate: Date;
  endDate: Date;
  church: IChurch[]
}