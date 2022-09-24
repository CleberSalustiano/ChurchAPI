import { ILocation } from "../../../entities/ILocation";
import { ICreateLocationDTO } from "../dtos/ICreateLocationDTO";
import { IUpdateLocationDTO } from "../dtos/IUpdateLocationDTO";

export interface ILocationRepository {
  create(data: ICreateLocationDTO): Promise<ILocation | undefined>
  findByCep(cep: number): Promise<ILocation | undefined>
  delete(id_location: number): Promise<boolean>
  update(data: IUpdateLocationDTO): Promise<ILocation | undefined>
}