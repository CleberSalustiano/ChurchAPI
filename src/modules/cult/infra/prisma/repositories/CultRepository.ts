import { ICult } from "../../../../../entities/ICult";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateCultDTO } from "../../../dtos/ICreateCultDTO";
import { IUpdateCultDTO } from "../../../dtos/IUpdateCultDTO";
import { ICultRepository } from "../../../repositories/ICultRepository";

export default class CultRepository implements ICultRepository {
  async create(dataCult: ICreateCultDTO): Promise<ICult | undefined> {
    return prismaClient.cult.create({
      data: {
        date: new Date(dataCult.date.toString()),
        deletedAt: null,
        theme: dataCult.theme,
        id_church: dataCult.id_church,
      },
    });
  }

  async findAll(): Promise<ICult[] | undefined> {
    return prismaClient.cult.findMany({
      where: { deletedAt: null },
    });
  }

  async findAllByChurch(id_church: number): Promise<ICult[] | undefined> {
    return prismaClient.cult.findMany({
      where: { id_church, deletedAt: null },
    });
  }

  async findById(id_cult: number): Promise<ICult | undefined> {
    const cult = await prismaClient.cult.findUnique({
      where: { id: id_cult },
    });

    return cult && !cult.deletedAt ? cult : undefined;
  }

  async delete(id_cult: number): Promise<boolean> {
    const cult = await prismaClient.cult.update({
      where: { id: id_cult },
      data: { deletedAt: new Date() },
    });

    return !!cult;
  }

  async update(dataCult: IUpdateCultDTO): Promise<ICult | undefined> {
    const existingCult = await this.findById(dataCult.id_cult);

    if (!existingCult) return undefined;

    return prismaClient.cult.update({
      where: { id: dataCult.id_cult },
      data: {
        date: new Date(dataCult.date.toString()),
        theme: dataCult.theme,
        id_church: dataCult.id_church,
      },
    });
  }
}
