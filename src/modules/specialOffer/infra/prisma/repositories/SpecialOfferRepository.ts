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
      data: { date: date.toString(), reason, id_church, id_member, id_offer },
    });

    return specialOffer;
  }
  public async findById(
    id_special_offer: number
  ): Promise<ISpecialOffer | null> {
    const specialOffer = await prismaClient.specialOffer.findFirst({
      where: { id: id_special_offer },
    });

    return specialOffer;
  }
  public async findAll(): Promise<ISpecialOffer[] | undefined> {
    const specialOffers = await prismaClient.specialOffer.findMany();

    return specialOffers;
  }
  public async update({
    date,
    id_church,
    id_member,
    id_special_offer,
    reason,
  }: IUpdateSpecialOfferDTO): Promise<ISpecialOffer | undefined> {
    const specialOffer = await prismaClient.specialOffer.update({
      where: { id: id_special_offer },
      data: { date: date.toString(), id_church, id_member, reason },
    });

    return specialOffer;
  }
  public async delete(id_special_offer: number): Promise<boolean> {
    const specialOffer = await prismaClient.specialOffer.delete({
      where: { id: id_special_offer },
    });

    return specialOffer ? true : false;
  }
}
