import { IChurch } from "./IChurch";
import { IMember } from "./IMember";

export interface IManager {
  id: number;
  id_member: number;
  member?: IMember;
  id_church: number;
  church?: IChurch;
  startDate: Date;
  endDate?: Date | null;
}
