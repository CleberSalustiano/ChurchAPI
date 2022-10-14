import { IChurch } from "../../../../../entities/IChurch";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateChurchDTO } from "../../../dtos/ICreateChurchDTO";
import { IUpdateChurchDTO } from "../../../dtos/IUpdateChurchDTO";
import { IChurchRepository } from "../../../repositories/IChurchRepository";

export default class ChurchRepository implements IChurchRepository {
  async create({
    date,
    id_location,
  }: ICreateChurchDTO): Promise<IChurch | undefined> {
    const church = await prismaClient.church.create({
      data: { creationDate: new Date(date.toString()), id_location },
      include: { location: true },
    });
    return church;
  }

  async findAll(): Promise<IChurch[] | undefined> {
    const churchs = await prismaClient.church.findMany({
      include: { location: true },
    });

    return churchs;
  }

  async findByLocation(id_location: number): Promise<IChurch | undefined> {
    const church = await prismaClient.church.findFirst({
      where: { id_location },
    });

    if (!church) return undefined;
    else return church;
  }

  async delete(id_church: number): Promise<boolean> {
    const church = await prismaClient.church.delete({
      where: { id: id_church },
    });

    if (church) return true;
    else return false;
  }

  async findById(id_church: number): Promise<IChurch | undefined> {
    const church = await prismaClient.church.findUnique({
      where: { id: id_church },
    });

    if (church) return church;
    else return undefined;
  }

  async update({
    date,
    id_church,
  }: IUpdateChurchDTO): Promise<IChurch | undefined> {
    const church = await prismaClient.church.update({
      where: { id: id_church },
      data: { creationDate: date.toString() },
      include: { location: true },
    });

    return church;
  }

  async findFirstChurch(): Promise<IChurch | undefined> {
    const church = await prismaClient.church.findFirst();

    if (!church) return undefined;

    return church;
  }
}
