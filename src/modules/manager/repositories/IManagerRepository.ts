import { IManager } from "../../../entities/IManager";
import { ICreateManagerDTO } from "../dtos/ICreateManagerDTO";

export interface IManagerRepository {
  create(dataManager: ICreateManagerDTO) : Promise<IManager | undefined>
}