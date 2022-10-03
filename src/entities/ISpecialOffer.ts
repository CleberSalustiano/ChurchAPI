import { IChurch } from "./IChurch";
import { IMember } from "./IMember";
import { IOffer } from "./IOffer";

export interface ISpecialOffer {
	id: number;
	reason: string;
	date: Date;
	id_offer: number;
  offer?: IOffer;
	id_member: number;
  member?: IMember
	id_church: number;
  church?: IChurch;
}
