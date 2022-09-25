export interface IMember {
  id: number;
  name: string;
  birth_date: Date;
  batism_date: Date;
  titleChurch: string;
  cpf: bigint | number;
  rg: number;
  login: string;
  email: string;
  password: string;
  foto: string | null;
  id_church: number;
}
