import { ICult } from "../../../entities/ICult";
import { ICreateCultDTO } from "../dtos/ICreateCultDTO";
import { IUpdateCultDTO } from "../dtos/IUpdateCultDTO";

export interface ICultRepository {
  create(dataCult: ICreateCultDTO) : Promise<ICult | undefined>
  findAll(): Promise<ICult[] | undefined>
  findById(id_cult: number) : Promise<ICult | undefined>
  delete(id_cult: number) : Promise<boolean>
  update(dataCult: IUpdateCultDTO) : Promise<ICult | undefined>
}