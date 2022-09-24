import { IChurch } from "../../../entities/IChurch";
import { ICreateChurchDTO } from "../dtos/ICreateChurchDTO";
import { IUpdateChurchDTO } from "../dtos/IUpdateChurchDTO";

export interface IChurchRepository {
  create(data: ICreateChurchDTO): Promise<IChurch | undefined>
  findAll(): Promise<IChurch[] | undefined>
  findByLocation(id_location: number): Promise<IChurch | undefined>
  delete(id_church: number): Promise<boolean>
  findById(id_church: number): Promise<IChurch | undefined>
  update(data: IUpdateChurchDTO): Promise<IChurch | undefined>
}