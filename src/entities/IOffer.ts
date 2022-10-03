import { ITreasurer } from "./ITreasurer";

export interface IOffer {
	id: number;
	value: number;
	id_treasurer: number;
  treasurer?: ITreasurer;
}
