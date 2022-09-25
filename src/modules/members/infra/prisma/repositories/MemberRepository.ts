import { Member, prisma } from "@prisma/client";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateMemberDTO } from "../../../dtos/ICreateMemberDTO";
import { IMemberRepository } from "../../../repositories/IMemberRepository";

export default class MemberRepository implements IMemberRepository {
  public async create(
   dataMember
  : ICreateMemberDTO): Promise<Member | undefined> {
    const member = await prismaClient.member.create({data: dataMember})

    return member;
  }
}
