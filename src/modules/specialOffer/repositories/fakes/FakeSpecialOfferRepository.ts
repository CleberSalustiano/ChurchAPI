import { ISpecialOffer } from "../../../../entities/ISpecialOffer";
import { ICreateSpecialOfferDTO } from "../../dtos/ICreateSpecialOfferDTO";
import { IUpdateSpecialOfferDTO } from "../../dtos/IUpdateSpecialOfferDTO";
import { ISpecialOfferRepository } from "../ISpecialOfferRepository";

export default class FakeSpecialOfferRepository
  implements ISpecialOfferRepository
{
  private specialOffers: ISpecialOffer[] = [];

  public async create({
    date,
    id_church,
    id_member,
    reason,
    id_offer,
  }: ICreateSpecialOfferDTO): Promise<ISpecialOffer | undefined> {
    const specialOffer: ISpecialOffer = {
      date: new Date(date.toString()),
      id: this.specialOffers.length,
      id_church,
      id_member,
      id_offer,
      reason,
    };

    this.specialOffers.push(specialOffer);
    return specialOffer;
  }

  public async findAll(): Promise<ISpecialOffer[] | undefined> {
    return this.specialOffers;
  }

  public async findById(
    id_special_offer: number
  ): Promise<ISpecialOffer | undefined> {
    const specialOffer = this.specialOffers.find(
      (specialOffer) => specialOffer.id === id_special_offer
    );

    return specialOffer;
  }

  public async update({
    date,
    id_church,
    id_member,
    id_special_offer,
    reason,
  }: IUpdateSpecialOfferDTO): Promise<ISpecialOffer | undefined> {
    const specialOfferIndex = this.specialOffers.findIndex(
      (specialOffer) => specialOffer.id === id_special_offer
    );

    if (specialOfferIndex === -1) return undefined;

    const specialOffer = this.specialOffers[specialOfferIndex];

    specialOffer.date = new Date(date.toString());
    specialOffer.id_church = id_church;
    specialOffer.id_member = id_member;
    specialOffer.reason = reason;

    this.specialOffers.splice(specialOfferIndex, 1, specialOffer);

    return specialOffer;
  }

  public async delete(id_special_offer: number): Promise<boolean> {
    const specialOfferIndex = this.specialOffers.findIndex(
      (specialOffer) => specialOffer.id === id_special_offer
    );

    if (specialOfferIndex === -1) return false;

    this.specialOffers.splice(specialOfferIndex, 1);

    return true;
  }
}
