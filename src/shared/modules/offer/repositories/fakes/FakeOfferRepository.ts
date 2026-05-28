import { IOffer } from "../../../../../entities/IOffer";
import { ICreateOfferDTO } from "../../dtos/ICreateOfferDTO";
import { IUpdateOfferDTO } from "../../dtos/IUpdateOfferDTO";
import { IOfferRepository } from "../IOfferRepository";

export default class FakeOfferRepository implements IOfferRepository {
  private offers: IOffer[] = [];

  public async create({
    id_treasurer,
    value,
  }: ICreateOfferDTO): Promise<IOffer | undefined> {
    const offer: IOffer = {
      id: this.offers.length,
      id_treasurer,
      value,
      deletedAt: null,
    };

    this.offers.push(offer);

    return offer;
  }

  public async findAll(): Promise<IOffer[] | undefined> {
    return this.offers.filter((offer) => !offer.deletedAt);
  }

  public async findAllByChurch(_id_church: number): Promise<IOffer[] | undefined> {
    return this.offers.filter((offer) => !offer.deletedAt);
  }

  public async findById(id_offer: number): Promise<IOffer | undefined> {
    const offer = this.offers.find(
      (offer) => offer.id === id_offer && !offer.deletedAt
    );

    return offer;
  }

  public async update({
    id_offer,
    id_treasurer,
    value,
  }: IUpdateOfferDTO): Promise<IOffer | undefined> {
    const offerIndex = this.offers.findIndex(
      (offer) => offer.id === id_offer && !offer.deletedAt
    );

    if (offerIndex === -1) return undefined;
    const offer = this.offers[offerIndex];
    offer.id_treasurer = id_treasurer;
    offer.value = value;

    this.offers.splice(offerIndex, 1, offer);

    return offer;
  }

  public async delete(id_offer: number): Promise<IOffer | undefined> {
    const offerIndex = this.offers.findIndex(
      (offer) => offer.id === id_offer && !offer.deletedAt
    );

    if (offerIndex === -1) return undefined;
    const offer = this.offers[offerIndex];
    offer.deletedAt = new Date();
    this.offers.splice(offerIndex, 1, offer);

    return offer;
  }
}
