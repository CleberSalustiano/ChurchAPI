import { ITithe } from "../../../../../entities/ITithe";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateTitheDTO } from "../../../dtos/ICreateTitheDTO";
import { IUpdateTitheDTO } from "../../../dtos/IUpdateTitheDTO";
import { ITitheRepository } from "../../../repositories/ITitheRepository";

export default class TitheRepository implements ITitheRepository {
  public async create({
    id_special_offer,
    month,
    year,
  }: ICreateTitheDTO): Promise<ITithe | undefined> {
    const tithe = await prismaClient.tithe.create({
      data: { id_special_offer, month, year },
      include: {
        specialOffer: {
          include: {
            church: true,
            member: true,
            offer: true,
          },
        },
      },
    });

    return tithe;
  }

  public async findAll(): Promise<ITithe[] | undefined> {
    const tithes = await prismaClient.tithe.findMany({
      include: {
        specialOffer: {
          include: {
            church: true,
            member: true,
            offer: true,
          },
        },
      },
    });

    return tithes;
  }

  public async findAllByChurch(id_church: number): Promise<ITithe[] | undefined> {
    const tithes = await prismaClient.tithe.findMany({
      where: {
        specialOffer: {
          id_church,
        },
      },
      include: {
        specialOffer: {
          include: {
            church: true,
            member: true,
            offer: true,
          },
        },
      },
    });

    return tithes;
  }

  public async findById(id_tithe: number): Promise<ITithe | undefined> {
    const tithe = await prismaClient.tithe.findFirst({
      where: { id: id_tithe },
      include: {
        specialOffer: {
          include: {
            church: true,
            member: true,
            offer: true,
          },
        },
      },
    });

    if (tithe) return tithe;

    return undefined;
  }

  public async update({
    id_tithe,
    month,
    year,
  }: IUpdateTitheDTO): Promise<ITithe | undefined> {
    const tithe = await prismaClient.tithe.update({
      where: { id: id_tithe },
      data: { month, year },
      include: {
        specialOffer: {
          include: {
            church: true,
            member: true,
            offer: true,
          },
        },
      },
    });

    return tithe;
  }

  public async delete(id_tithe: number): Promise<boolean> {
    const tithe = await prismaClient.tithe.delete({
      where: { id: id_tithe },
    });

    return !!tithe;
  }
}
