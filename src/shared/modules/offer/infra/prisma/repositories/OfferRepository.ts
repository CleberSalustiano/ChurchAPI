
import { IOffer } from "../../../../../../entities/IOffer";
import prismaClient from "../../../../../infra/database/prismaClient";
import { ICreateOfferDTO } from "../../../dtos/ICreateOfferDTO";
import { IUpdateOfferDTO } from "../../../dtos/IUpdateOfferDTO";
import { IOfferRepository } from "../../../repositories/IOfferRepository";

export default class OfferRepository implements IOfferRepository {
  public async create({
    id_treasurer,
    value,
  }: ICreateOfferDTO): Promise<IOffer | undefined> {
    const offer = await prismaClient.offer.create({
      data: { value, id_treasurer },
    });

    return offer;
  }

  public async findAll(): Promise<IOffer[] | undefined> {
    const offers = await prismaClient.offer.findMany();

    return offers;
  }

  public async findById(id_offer: number): Promise<IOffer | undefined> {
    const offer = await prismaClient.offer.findFirst({
      where: { id: id_offer },
    });

    if (offer) return offer;
    else return undefined;
  }

  public async update({
    id_offer,
    id_treasurer,
    value,
  }: IUpdateOfferDTO): Promise<IOffer | undefined> {
    const offer = await prismaClient.offer.update({
      where: { id: id_offer },
      data: { id_treasurer, value },
    });

    return offer;
  }

  public async delete(id_offer: number): Promise<IOffer | undefined> {
    const offer = await prismaClient.offer.delete({
      where: { id: id_offer },
    });

    return offer;
  }
}
