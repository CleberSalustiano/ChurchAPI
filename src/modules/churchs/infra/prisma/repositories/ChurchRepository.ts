import { Church } from ".prisma/client";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateChurchDTO } from "../../../dtos/ICreateChurchDTO";
import { IChurchRepository } from "../../../repositories/IChurchRepository";

export default class ChurchRepository implements IChurchRepository {
  async create({ date, id_location }: ICreateChurchDTO): Promise<Church | undefined> {
    const church = await prismaClient.church.create({
      data: { creationDate: date, id_location }, include: { location: true }
    })
    return church;
  }

  async findAll(): Promise<Church[] | undefined> {
    const churchs = await prismaClient.church.findMany({ include: { location: true } });

    return churchs
  }

  async findByLocation(id_location: number): Promise<Church | undefined> {
    const church = await prismaClient.church.findFirst({ where: { id_location } })

    if (!church)
      return undefined
    else
      return church
  }
}