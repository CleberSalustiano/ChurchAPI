import { ICult } from "../../../entities/ICult";
import { ICreateCultDTO } from "../dtos/ICreateCultDTO";

export interface ICultRepository {
  create(dataCult: ICreateCultDTO) : Promise<ICult | undefined>
  findAll(): Promise<ICult[] | undefined>
  findById(id_cult: number) : Promise<ICult | undefined>
}