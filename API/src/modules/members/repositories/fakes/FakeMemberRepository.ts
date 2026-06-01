import { IMember } from "../../../../entities/IMember";
import { ICreateMemberDTO } from "../../dtos/ICreateMemberDTO";
import { IUpdateOwnMemberProfileDTO } from "../../dtos/IUpdateOwnMemberProfileDTO";
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
    ecclesiasticalRole,
    id_church,
    id_user,
  }: ICreateMemberDTO): Promise<IMember | undefined> {
    const member: IMember = {
      batism_date: new Date(batism_date.toString()),
      birth_date: new Date(birth_date.toString()),
      church: {
        id: id_church,
        creationDate: new Date("2020-01-01"),
        type: "BRANCH",
        status: "ACTIVE",
        id_location: id_church,
      },
      cpf,
      deletedAt: null,
      email,
      id: this.members.length,
      name,
      id_user,
      rg,
      ecclesiasticalRole,
      foto: null,
      id_church,
    };

    this.members.push(member);

    return member;
  }

  public async findAll(): Promise<IMember[] | undefined> {
    return this.members.filter((member) => !member.deletedAt);
  }

  public async findByCPF(cpf: bigint): Promise<IMember | undefined> {
    const member = this.members.find(
      (member) => member.cpf === cpf && !member.deletedAt
    );

    return member;
  }

  public async findByEmail(email: string): Promise<IMember | undefined> {
    return this.members.find(
      (member) => member.email === email && !member.deletedAt
    );
  }

  public async update({
    batism_date,
    birth_date,
    email,
    id_church,
    id_member,
    name,
    rg,
    ecclesiasticalRole,
    cpf,
  }: IUpdateMemberDTO): Promise<IMember | undefined> {
    const memberIndex = this.members.findIndex(
      (member) => member.id === id_member && !member.deletedAt
    );

    if (memberIndex === -1) return undefined;

    const member = this.members[memberIndex];
    member.batism_date = new Date(batism_date.toString());
    member.birth_date = new Date(birth_date.toString());
    member.email = email;
    member.id_church = id_church;
    member.church = {
      id: id_church,
      creationDate: member.church?.creationDate || new Date("2020-01-01"),
      type: member.church?.type || "BRANCH",
      status: member.church?.status || "ACTIVE",
      id_location: member.church?.id_location || id_church,
    };
    member.name = name;
    member.rg = rg;
    member.ecclesiasticalRole = ecclesiasticalRole;

    if (cpf) member.cpf = cpf;

    this.members.splice(memberIndex, 1, member);

    return member;
  }

  public async updateOwnProfile({
    birth_date,
    email,
    id_member,
    name,
    rg,
  }: IUpdateOwnMemberProfileDTO): Promise<IMember | undefined> {
    const memberIndex = this.members.findIndex(
      (member) => member.id === id_member && !member.deletedAt
    );

    if (memberIndex === -1) return undefined;

    const member = this.members[memberIndex];
    member.birth_date = new Date(birth_date.toString());
    member.email = email;
    member.name = name;
    member.rg = rg;

    this.members.splice(memberIndex, 1, member);

    return member;
  }

  async findById(id_member: number): Promise<IMember | undefined> {
    const member = this.members.find(
      (member) => member.id === id_member && !member.deletedAt
    );

    return member;
  }

  async findByUserId(id_user: number): Promise<IMember | undefined> {
    const member = this.members.find(
      (member) => member.id_user === id_user && !member.deletedAt
    );

    return member;
  }

  async findAllbyChurch(id_church: number): Promise<IMember[] | undefined> {
    const members = this.members.filter(
      (member) => member.id_church === id_church && !member.deletedAt
    );

    return members;
  }

  async delete(id_member: number): Promise<boolean> {
    const memberIndex = this.members.findIndex(
      (member) => member.id === id_member && !member.deletedAt
    );

    if (memberIndex === -1) {
      return false;
    }

    const member = this.members[memberIndex];
    member.deletedAt = new Date();
    this.members.splice(memberIndex, 1, member);

    if (member) return true;

    return false;
  }
}
