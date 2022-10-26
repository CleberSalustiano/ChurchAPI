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
    name,
    rg,
    titleChurch,
    id_church,
    id_user,
  }: ICreateMemberDTO): Promise<IMember | undefined> {
    const member: IMember = {
      batism_date: new Date(batism_date.toString()),
      birth_date: new Date(birth_date.toString()),
      cpf,
      email,
      id: this.members.length,
      name,
      id_user,
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
    name,
    rg,
    titleChurch,
    cpf,
  }: IUpdateMemberDTO): Promise<IMember | undefined> {
    const memberIndex = this.members.findIndex(
      (member) => member.id === id_member
    );

    if (memberIndex === -1) return undefined;

    const member = this.members[memberIndex];
    member.batism_date = new Date(batism_date.toString());
    member.birth_date = new Date(birth_date.toString());
    member.email = email;
    member.id_church = id_church;
    member.name = name;
    member.rg = rg;
    member.titleChurch = titleChurch;

    if (cpf) member.cpf = cpf;

    this.members.splice(memberIndex, 1, member);

    return member;
  }

  async findById(id_member: number): Promise<IMember | undefined> {
    const member = this.members.find((member) => member.id === id_member);

    return member;
  }

  async findAllbyChurch(id_church: number): Promise<IMember[] | undefined> {
    const members = this.members.filter(
      (member) => member.id_church === id_church
    );

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
