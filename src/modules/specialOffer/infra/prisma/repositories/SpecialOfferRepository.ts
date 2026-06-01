import { ISpecialOffer } from "../../../../../entities/ISpecialOffer";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateSpecialOfferDTO } from "../../../dtos/ICreateSpecialOfferDTO";
import { IUpdateSpecialOfferDTO } from "../../../dtos/IUpdateSpecialOfferDTO";
import { ISpecialOfferRepository } from "../../../repositories/ISpecialOfferRepository";

export default class SpecialOfferRepository implements ISpecialOfferRepository {
  public async create({
    date,
    id_church,
    id_member,
    id_offer,
    reason,
  }: ICreateSpecialOfferDTO): Promise<ISpecialOffer | undefined> {
    const specialOffer = await prismaClient.specialOffer.create({
      data: {
        date: new Date(date.toString()),
        reason,
        deletedAt: null,
        id_church,
        id_member,
        id_offer,
      },
    });

    return specialOffer;
  }
  public async findById(
    id_special_offer: number
  ): Promise<ISpecialOffer | null> {
    const specialOffer = await prismaClient.specialOffer.findFirst({
      where: { id: id_special_offer, deletedAt: null },
    });

    return specialOffer;
  }
  public async findAll(): Promise<ISpecialOffer[] | undefined> {
    const specialOffers = await prismaClient.specialOffer.findMany({
      where: { deletedAt: null },
    });

    return specialOffers;
  }
  public async findAllByChurch(
    id_church: number
  ): Promise<ISpecialOffer[] | undefined> {
    const specialOffers = await prismaClient.specialOffer.findMany({
      where: { id_church, deletedAt: null },
    });

    return specialOffers;
  }
  public async update({
    date,
    id_church,
    id_member,
    id_special_offer,
    reason,
  }: IUpdateSpecialOfferDTO): Promise<ISpecialOffer | undefined> {
    const existingSpecialOffer = await this.findById(id_special_offer);

    if (!existingSpecialOffer) return undefined;

    const specialOffer = await prismaClient.specialOffer.update({
      where: { id: id_special_offer },
      data: { date: date.toString(), id_church, id_member, reason },
    });

    return specialOffer;
  }
  public async delete(id_special_offer: number): Promise<boolean> {
    const specialOffer = await prismaClient.specialOffer.update({
      where: { id: id_special_offer },
      data: { deletedAt: new Date() },
    });

    return specialOffer ? true : false;
  }
}
