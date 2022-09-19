import { IChurch } from "./IChurch";

export interface ICost {
  value: Number;
  date: Date;
  description: String;
  church: IChurch;
}