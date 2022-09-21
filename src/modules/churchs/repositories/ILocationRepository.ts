import { Location } from ".prisma/client";
import { ICreateLocationDTO } from "../dtos/ICreateLocationDTO";

export interface ILocationRepository {
  create(data: ICreateLocationDTO): Promise<Location | undefined>
  findByCep(cep: number): Promise<Location | undefined>
}