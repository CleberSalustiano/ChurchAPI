import { IChurch } from "./IChurch";
import { IMember } from "./IMember";

export interface IManager {
  id: number;
  id_member: number;
  member?: IMember;
  id_church: number;
  church?: IChurch;
  dateStart: Date;
  dateEnd?: Date | null;
}
