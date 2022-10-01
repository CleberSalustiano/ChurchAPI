import { IManager } from "../../../entities/IManager";
import { ICreateManagerDTO } from "../dtos/ICreateManagerDTO";
import { IUpdateManagerDTO } from "../dtos/IUploadManagerDTO";

export interface IManagerRepository {
  create(dataManager: ICreateManagerDTO) : Promise<IManager | undefined>
  findAllbyChurch(id_church : number) : Promise<IManager[] | undefined>
  findById(id_manager: number): Promise<IManager | undefined>
  update(dataManager: IUpdateManagerDTO): Promise<IManager | undefined>
}