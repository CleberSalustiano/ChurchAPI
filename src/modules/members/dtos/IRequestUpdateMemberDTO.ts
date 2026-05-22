export interface IRequestUpdateMemberDTO {
	name: string;
	birth_date: String;
	batism_date: String;
	ecclesiasticalRole: string;
	cpf: bigint;
	rg: number;
	email: string;
  login: string;
	password: string;
  id_church: number;
  id_member: number;
}
