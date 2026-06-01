import { IChurch } from "./IChurch";
import { IUser } from "./IUser";

export interface IMember {
  id: number;
  name: string;
  birth_date: Date;
  batism_date: Date;
  ecclesiasticalRole: string;
  cpf: bigint | number | string;
  rg: number;
  email: string;
  foto: string | null;
  deletedAt?: Date | null;
  id_church: number;
  church?: IChurch;
  id_user: number;
  user?: IUser;
}
