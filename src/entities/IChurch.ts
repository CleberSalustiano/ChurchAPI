import { ICost } from "./ICost";
import { ICult } from "./ICult";
import { ILocation } from "./ILocation";
import { IMember } from "./IMember";
import { ISpecialOffer } from "./ISpecialOffer";

export interface IChurch {
  creationDate: Date;
  location: ILocation;
  costs: ICost[];
  members: IMember[];
  cults: ICult[];
  specialOffers: ISpecialOffer[];
}