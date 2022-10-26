import { IMember } from "./IMember";

export interface IUser {
  id: number;
  password: string;
  member?: IMember[];
}
