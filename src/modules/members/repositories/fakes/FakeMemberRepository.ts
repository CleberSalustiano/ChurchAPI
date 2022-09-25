import { IMember } from "../../../../entities/IMember";
import { ICreateMemberDTO } from "../../dtos/ICreateMemberDTO";
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
    id_church
  }: ICreateMemberDTO): Promise<IMember | undefined> {
    const member: IMember = {
      batism_date,
      birth_date,
      cpf,
      email,
      id: 0,
      login,
      name,
      password,
      rg,
      titleChurch,
      foto: null,
      id_church
    };

    this.members.push(member);

    return member;
  }

  public async findAll(): Promise<IMember[] | undefined> {
    return this.members;
  }
}
