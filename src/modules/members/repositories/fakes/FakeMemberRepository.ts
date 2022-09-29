import { IMember } from "../../../../entities/IMember";
import { ICreateMemberDTO } from "../../dtos/ICreateMemberDTO";
import { IUpdateMemberDTO } from "../../dtos/IUpdateMemberDTO";
import { IMemberRepository } from "../IMemberRepository";

export default class FakeMemberRepository implements IMemberRepository {
  private members: IMember[] = [];

  public async create({
    batism_date,
    birth_date,
    cpf,
    email,
    login,
    name,
    password,
    rg,
    titleChurch,
    id_church,
  }: ICreateMemberDTO): Promise<IMember | undefined> {
    const member: IMember = {
      batism_date,
      birth_date,
      cpf,
      email,
      id: this.members.length,
      login,
      name,
      password,
      rg,
      titleChurch,
      foto: null,
      id_church,
    };

    this.members.push(member);

    return member;
  }

  public async findAll(): Promise<IMember[] | undefined> {
    return this.members;
  }

  public async findByCPF(cpf: bigint): Promise<IMember | undefined> {
    const member = this.members.find((member) => member.cpf === cpf);

    return member;
  }

  public async update({
    batism_date,
    birth_date,
    email,
    id_church,
    id_member,
    login,
    name,
    password,
    rg,
    titleChurch,
    cpf,
  }: IUpdateMemberDTO): Promise<IMember | undefined> {
    const memberIndex = this.members.findIndex(
      (member) => member.id === id_church
    );

    if (memberIndex === -1) return undefined;

    const member = this.members[memberIndex];
    member.batism_date = batism_date;
    member.birth_date = birth_date;
    member.email = email;
    member.id_church = id_church;
    member.login = login;
    member.name = name;
    member.password = password;
    member.rg = rg;
    member.titleChurch = titleChurch;

    if (cpf) member.cpf = cpf;

    this.members.splice(memberIndex, 1, member);

    return member;
  }

  async findById(id_member: number): Promise<IMember | undefined> {
    const member = this.members.find(member => member.id === id_member);

    return member;
  }

  async findAllbyChurch(id_church: number): Promise<IMember[] | undefined> {
    const members = this.members.filter(member => member.id_church === id_church);

    return members;
  }

  async delete(id_member: number): Promise<boolean> {
    const memberIndex = this.members.findIndex(
			(member) => member.id === id_member
		);

		if (memberIndex === -1) {
			return false;
		}

		const member = this.members.splice(memberIndex, 1);

		if (member) return true;

		return false;
  }
}
