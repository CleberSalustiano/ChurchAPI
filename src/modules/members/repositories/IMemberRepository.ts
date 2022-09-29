import { IMember } from "../../../entities/IMember";
import { ICreateMemberDTO } from "../dtos/ICreateMemberDTO";
import { IUpdateMemberDTO } from "../dtos/IUpdateMemberDTO";

export interface IMemberRepository {
  create(data: ICreateMemberDTO): Promise<IMember | undefined>
  findAll(): Promise<IMember[] | undefined>
  findByCPF(cpf: bigint): Promise<IMember | undefined>
  update(data: IUpdateMemberDTO): Promise<IMember | undefined>
  findById(id_member: number): Promise<IMember | undefined>
  findAllbyChurch(id_church: number) : Promise<IMember[] | undefined>
  delete(id_member: number) : Promise<boolean>
}