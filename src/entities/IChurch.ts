import { ILocation } from "./ILocation";
import { IManager } from "./IManager";

export interface IChurch {
  id: number;
  creationDate: Date;
  id_location: number;
  location?: ILocation;
}
