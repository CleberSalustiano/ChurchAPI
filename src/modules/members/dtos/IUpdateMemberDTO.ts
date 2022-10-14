export interface IUpdateMemberDTO {
  id_member: number;
  name: string;
  birth_date: String;
  batism_date: String;
  titleChurch: string;
  cpf?: bigint;
  rg: number;
  login: string;
  email: string;
  password: string;
  id_church: number;
}
