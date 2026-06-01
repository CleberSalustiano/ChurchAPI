import { IChurch } from "./IChurch";
import { IOffer } from "./IOffer";

export interface ICult {
	id: number;
	date: Date;
	theme: string;
	deletedAt?: Date | null;
	id_offer?: number | null;
  offer?: IOffer;
	id_church: number;
  church?: IChurch;
}
