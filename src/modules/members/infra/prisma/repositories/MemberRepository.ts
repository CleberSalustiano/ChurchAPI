import { IMember } from "../../../../../entities/IMember";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateMemberDTO } from "../../../dtos/ICreateMemberDTO";
import { IMemberRepository } from "../../../repositories/IMemberRepository";

export default class MemberRepository implements IMemberRepository {
  public async create(
   dataMember
  : ICreateMemberDTO): Promise<IMember | undefined> {
    const member = await prismaClient.member.create({data: dataMember})

    return member;
  }

  public async findAll(): Promise<IMember[] | undefined> {
    const members = await prismaClient.member.findMany();

    if (members){
      const membersJSON = members.map(member => {
        // @ts-ignore
        member.cpf = +member.cpf.toString();
        return member;
      })
      return membersJSON
    }
      
    return members
  }
}
