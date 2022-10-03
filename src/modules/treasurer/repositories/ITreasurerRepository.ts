import { ITreasurer } from "../../../entities/ITreasurer";

export interface ITreasurerRepository {
  findById(id_treasurer: number): Promise<ITreasurer | undefined>
  create(id_member: number): Promise<ITreasurer | undefined>
  findAll(): Promise<ITreasurer[] | undefined>
}