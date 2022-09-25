import { IMember } from "../../../entities/IMember";
import { ICreateMemberDTO } from "../dtos/ICreateMemberDTO";

export interface IMemberRepository {
  create(data : ICreateMemberDTO) : Promise<IMember | undefined>
  findAll() : Promise<IMember[] | undefined>
}