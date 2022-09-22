import { Church } from "@prisma/client";
import { ICreateChurchDTO } from "../dtos/ICreateChurchDTO";
import { IUpdateChurchDTO } from "../dtos/IUpdateChurchDTO";

export interface IChurchRepository {
  create(data: ICreateChurchDTO): Promise<Church | undefined>
  findAll(): Promise<Church[] | undefined>
  findByLocation(id_location: number): Promise<Church | undefined>
  delete(id_church: number): Promise<boolean>
  findById(id_church: number): Promise<Church | undefined>
  update(data: IUpdateChurchDTO): Promise<Church | undefined>
}