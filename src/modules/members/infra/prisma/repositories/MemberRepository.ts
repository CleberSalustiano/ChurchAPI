import { Member } from "@prisma/client";
import { ICreateMemberDTO } from "../../../dtos/ICreateMemberDTO";
import { IMemberRepository } from "../../../repositories/IMemberRepository";

export default class MemberRepository implements IMemberRepository {
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
  }: ICreateMemberDTO): Promise<Member | undefined> {
  }
}
