import { ICost } from "../../../../../entities/ICost";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateCostDTO } from "../../../dtos/ICreateCostDTO";
import { IUpdateCostDTO } from "../../../dtos/IUpdateCostDTO";
import { ICostRepository } from "../../../repositories/ICostRepository";

export default class CostRepository implements ICostRepository {
  async create(dataCost: ICreateCostDTO): Promise<ICost | undefined> {
    return prismaClient.cost.create({
      data: {
        value: dataCost.value,
        date: new Date(dataCost.date.toString()),
        description: dataCost.description.toString(),
        deletedAt: null,
        id_church: dataCost.id_church,
      },
    });
  }

  async findAll(): Promise<ICost[] | undefined> {
    return prismaClient.cost.findMany({
      where: { deletedAt: null },
    });
  }

  async findAllByChurch(id_church: number): Promise<ICost[] | undefined> {
    return prismaClient.cost.findMany({
      where: { id_church, deletedAt: null },
    });
  }

  async findById(id_cost: number): Promise<ICost | undefined> {
    const cost = await prismaClient.cost.findUnique({
      where: { id: id_cost },
    });

    return cost && !cost.deletedAt ? cost : undefined;
  }

  async update(dataCost: IUpdateCostDTO): Promise<ICost | undefined> {
    const existingCost = await this.findById(dataCost.id_cost);

    if (!existingCost) return undefined;

    return prismaClient.cost.update({
      where: { id: dataCost.id_cost },
      data: {
        value: dataCost.value,
        date: new Date(dataCost.date.toString()),
        description: dataCost.description.toString(),
      },
    });
  }

  async delete(id_cost: number): Promise<boolean> {
    const cost = await prismaClient.cost.update({
      where: { id: id_cost },
      data: { deletedAt: new Date() },
    });

    return !!cost;
  }
}
