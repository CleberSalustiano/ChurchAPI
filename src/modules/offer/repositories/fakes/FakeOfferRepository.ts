import { IOffer } from "../../../../entities/IOffer";
import { ICreateOfferDTO } from "../../dtos/ICreateOfferDTO";
import { IOfferRepository } from "../IOfferRepository";

export default class FakeOfferRepository implements IOfferRepository {
  private offers: IOffer[] = [];

  public async create({
    id_treasurer,
    value,
  }: ICreateOfferDTO): Promise<IOffer | undefined> {
    const offer: IOffer = { id: this.offers.length, id_treasurer, value };

    this.offers.push(offer);

    return offer;
  }

  public async findAll(): Promise<IOffer[] | undefined> {
    return this.offers;
  }

  public async findById(id_offer: number): Promise<IOffer | undefined> {
    const offer = this.offers.find((offer) => offer.id === id_offer);

    return offer;
  }
}
