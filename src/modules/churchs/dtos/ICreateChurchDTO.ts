import { ChurchType } from "../../../entities/IChurch";

export interface ICreateChurchDTO {
  date: String;
  id_location: number;
  type?: ChurchType;
  parent_church_id?: number | null;
}
