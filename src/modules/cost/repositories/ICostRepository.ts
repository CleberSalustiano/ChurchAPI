import { ICost } from "../../../entities/ICost"
import { ICreateCostDTO } from "../dtos/ICreateCostDTO"
import { IUpdateCostDTO } from "../dtos/IUpdateCostDTO"

export interface ICostRepository {
  create(dataCost: ICreateCostDTO) : Promise<ICost | undefined>
  findAll() : Promise<ICost[] | undefined>
  findById(id_cost: number): Promise<ICost | undefined>
  update(dateCost: IUpdateCostDTO) : Promise<ICost | undefined>
  delete(id_cost: number): Promise<boolean>
}