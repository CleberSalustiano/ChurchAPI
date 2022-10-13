import { ITreasurer } from "../../../entities/ITreasurer";
import { IUpdateTreasurerDTO } from "../dtos/IUpdateTreasurerDTO";

export interface ITreasurerRepository {
  findById(id_treasurer: number): Promise<ITreasurer | undefined>;
  create(id_member: number): Promise<ITreasurer | undefined>;
  findAllActive(): Promise<ITreasurer[] | undefined>;
  update(data: IUpdateTreasurerDTO): Promise<ITreasurer | undefined>;
  findByMember(id_member: number): Promise<ITreasurer | undefined>;
  endTreasurer(id_treasurer: number): Promise<ITreasurer | undefined>;
}
