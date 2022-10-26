export interface IRequestUpdateMemberDTO {
	name: string;
	birth_date: String;
	batism_date: String;
	titleChurch: string;
	cpf: bigint;
	rg: number;
	email: string;
	password: string;
  id_church: number;
  id_member: number;
}
