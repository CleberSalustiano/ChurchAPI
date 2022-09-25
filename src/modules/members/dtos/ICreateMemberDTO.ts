export interface ICreateMemberDTO {
	name: string;
	birth_date: Date;
	batism_date: Date;
	titleChurch: string;
	cpf: bigint;
	rg: number;
	login: string;
	email: string;
	password: string;
  id_church: number;
}
