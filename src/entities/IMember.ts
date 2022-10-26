import { IChurch } from "./IChurch";
import { IUser } from "./IUser";

export interface IMember {
  id: number;
  name: string;
  birth_date: Date;
  batism_date: Date;
  titleChurch: string;
  cpf: bigint | number;
  rg: number;
  email: string;
  foto: string | null;
  id_church: number;
  church?: IChurch;
  id_user: number;
  user?: IUser;
}
