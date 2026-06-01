import { IMember } from "./IMember";

export interface IUser {
  id: number;
  login: string;
  password: string;
  deletedAt?: Date | null;
  member?: IMember[];
}
