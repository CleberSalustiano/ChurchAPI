import { Location } from "@prisma/client";
import { ICreateLocationDTO } from "../dtos/ICreateLocationDTO";
import { IUpdateLocationDTO } from "../dtos/IUpdateLocationDTO";

export interface ILocationRepository {
  create(data: ICreateLocationDTO): Promise<Location | undefined>
  findByCep(cep: number): Promise<Location | undefined>
  delete(id_location: number): Promise<boolean>
  update(data: IUpdateLocationDTO): Promise<Location | undefined>
}