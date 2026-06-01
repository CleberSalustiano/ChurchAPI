import { IChurch } from "./IChurch";
import { ICultOffer } from "./ICultOffer";
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
  recurrenceGroup?: string | null;
  recurrencePattern?: string | null;
  recurrenceUntil?: Date | null;
  CultOffer?: ICultOffer[];
}
