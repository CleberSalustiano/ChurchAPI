import { ITreasurer } from "./ITreasurer";

export interface IOffer {
	id: number;
	value: number;
	deletedAt?: Date | null;
	id_treasurer: number;
  treasurer?: ITreasurer;
}
