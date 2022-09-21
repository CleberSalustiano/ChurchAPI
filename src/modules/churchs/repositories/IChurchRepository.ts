import { Church } from ".prisma/client";
import { ICreateChurchDTO } from "../dtos/ICreateChurchDTO";

export interface IChurchRepository {
  create(data: ICreateChurchDTO): Promise<Church | undefined>
  findAll(): Promise<Church[] | undefined>
  findByLocation(id_location: number): Promise<Church | undefined>
}