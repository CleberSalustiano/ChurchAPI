import { ITreasurer } from "../../../../../entities/ITreasurer";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { IUpdateTreasurerDTO } from "../../../dtos/IUpdateTreasurerDTO";
import { ITreasurerRepository } from "../../../repositories/ITreasurerRepository";

export default class TreasurerRepository implements ITreasurerRepository {
  public async create(id_member: number): Promise<ITreasurer | undefined> {
    const treasurer = await prismaClient.treasurer.create({
      data: { id_member },
      include: { member: true },
    });

    return treasurer;
  }

  public async findById(id_treasurer: number): Promise<ITreasurer | undefined> {
    const treasurer = await prismaClient.treasurer.findFirst({
      where: { id: id_treasurer, endDate: null },
    });

    if (!treasurer) return undefined;

    return treasurer;
  }

  public async findAllActive(): Promise<ITreasurer[] | undefined> {
    const treasurers = await prismaClient.treasurer.findMany({
      where: { endDate: null },
    });

    return treasurers;
  }

  public async findByMember(
    id_member: number
  ): Promise<ITreasurer | undefined> {
    const treasurer = await prismaClient.treasurer.findFirst({
      where: { endDate: null, id_member },
    });

    if (treasurer) return treasurer;
    else return undefined;
  }

  public async update(
    data: IUpdateTreasurerDTO
  ): Promise<ITreasurer | undefined> {
    const treasurer = await prismaClient.treasurer.update({
      where: { id: data.id_treasurer },
      data: { id_member: data.id_member },
    });

    return treasurer;
  }

  public async endTreasurer(
    id_treasurer: number
  ): Promise<ITreasurer | undefined> {
    const treasurer = await prismaClient.treasurer.update({
      where: { id: id_treasurer },
      data: { endDate: new Date() },
    });

    return treasurer;
  }
}
