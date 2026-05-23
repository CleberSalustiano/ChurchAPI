import { ILocation } from "./ILocation";

export type ChurchType = "HEADQUARTER" | "BRANCH";
export type ChurchStatus = "ACTIVE" | "INACTIVE" | "DELETED";

export interface IChurch {
  id: number;
  creationDate: Date;
  type: ChurchType;
  status: ChurchStatus;
  parentChurchId?: number | null;
  deactivatedAt?: Date | null;
  deletedAt?: Date | null;
  id_location: number;
  location?: ILocation;
}
