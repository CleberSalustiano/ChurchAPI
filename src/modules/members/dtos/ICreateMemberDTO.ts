export interface ICreateMemberDTO {
	name: string;
	birth_date: String;
	batism_date: String;
	titleChurch: string;
	cpf: bigint;
	rg: number;
	email: string;
  id_church: number;
	id_user: number;
}
