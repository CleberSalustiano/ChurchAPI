import { Member } from "@prisma/client";
import { ICreateMemberDTO } from "../dtos/ICreateMemberDTO";

export interface IMemberRepository {
  create(data : ICreateMemberDTO) : Promise<Member | undefined>
}