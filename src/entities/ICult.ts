import { IChurch } from "./IChurch";
import { IOffer } from "./IOffer";

export interface ICult {
	id: number;
	date: Date;
	theme: string;
	id_offer?: number;
  offer?: IOffer;
	id_church: number;
  church?: IChurch;
}
