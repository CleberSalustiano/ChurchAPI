import { IChurch } from "../../../../../entities/IChurch";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateChurchDTO } from "../../../dtos/ICreateChurchDTO";
import { IUpdateChurchDTO } from "../../../dtos/IUpdateChurchDTO";
import { IChurchRepository } from "../../../repositories/IChurchRepository";

export default class ChurchRepository implements IChurchRepository {
  async create({
    date,
    id_location,
    parent_church_id,
    type,
  }: ICreateChurchDTO): Promise<IChurch | undefined> {
    const church = await prismaClient.church.create({
      data: {
        creationDate: new Date(date.toString()),
        id_location,
        parentChurchId: parent_church_id ?? null,
        type: type ?? "BRANCH",
      },
      include: { location: true },
    });
    return church;
  }

  async findAll(): Promise<IChurch[] | undefined> {
    const churchs = await prismaClient.church.findMany({
      where: {
        status: {
          not: "DELETED",
        },
      },
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
    const church = await prismaClient.church.update({
      where: { id: id_church },
      data: {
        status: "DELETED",
        deletedAt: new Date(),
        deactivatedAt: new Date(),
      },
    });

    if (church) return true;
    else return false;
  }

  async deactivate(id_church: number): Promise<IChurch | undefined> {
    return prismaClient.church.update({
      where: { id: id_church },
      data: {
        status: "INACTIVE",
        deactivatedAt: new Date(),
      },
      include: { location: true },
    });
  }

  async reactivate(id_church: number): Promise<IChurch | undefined> {
    return prismaClient.church.update({
      where: { id: id_church },
      data: {
        status: "ACTIVE",
        deactivatedAt: null,
      },
      include: { location: true },
    });
  }

  async findById(id_church: number): Promise<IChurch | undefined> {
    const church = await prismaClient.church.findFirst({
      where: {
        id: id_church,
        status: {
          not: "DELETED",
        },
      },
      include: { location: true },
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
    const church = await prismaClient.church.findFirst({
      where: {
        status: {
          not: "DELETED",
        },
      },
    });

    if (!church) return undefined;

    return church;
  }

  async findHeadquarter(): Promise<IChurch | undefined> {
    const church = await prismaClient.church.findFirst({
      where: {
        type: "HEADQUARTER",
        status: {
          not: "DELETED",
        },
      },
      include: { location: true },
    });

    return church ?? undefined;
  }
}
