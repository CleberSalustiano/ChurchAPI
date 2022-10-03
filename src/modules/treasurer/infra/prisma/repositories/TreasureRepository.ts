import { ITreasurer } from "../../../../../entities/ITreasurer";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ITreasurerRepository } from "../../../repositories/ITreasurerRepository";

export default class TreasurerRepository implements ITreasurerRepository {
  public async create(id_member: number): Promise<ITreasurer | undefined> {
    const treasurer = await prismaClient.treasurer.create({
      data: { id_member },
      include: {member: true}
    });

    return treasurer;
  }

  public async findById(id_treasurer: number): Promise<ITreasurer | undefined> {
    const treasurer = await prismaClient.treasurer.findFirst({
      where: { id: id_treasurer },
    });

    if (!treasurer) return undefined;

    return treasurer;
  }

  public async findAll(): Promise<ITreasurer[] | undefined> {
    const treasurers = await prismaClient.treasurer.findMany();

    return treasurers;
  }
}
