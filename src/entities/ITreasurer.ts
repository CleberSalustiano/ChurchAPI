import { IMember } from "./IMember";

export interface ITreasurer {
	id: number;
	startDate: Date;
	endDate?: Date | null;
	id_member: number;
  member?: IMember;
}
