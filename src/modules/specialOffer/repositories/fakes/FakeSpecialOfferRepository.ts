import { ISpecialOffer } from "../../../../entities/ISpecialOffer";
import { ICreateSpecialOfferDTO } from "../../dtos/ICreateSpecialOfferDTO";
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

  public async findById(id_special_offer: number): Promise<ISpecialOffer | undefined> {
    const specialOffer = this.specialOffers.find(specialOffer => specialOffer.id === id_special_offer);

    return specialOffer;
  }
  
}
