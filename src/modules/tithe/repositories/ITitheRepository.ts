import { ITithe } from "../../../entities/ITithe";
import { ICreateTitheDTO } from "../dtos/ICreateTitheDTO";
import { IUpdateTitheDTO } from "../dtos/IUpdateTitheDTO";

export interface ITitheRepository {
  create(dataTithe: ICreateTitheDTO) : Promise<ITithe | undefined>
  findAll() : Promise<ITithe[] | undefined>
  findById(id_tithe: number) : Promise<ITithe | undefined>
  update(dataTithe: IUpdateTitheDTO) : Promise<ITithe | undefined>
  delete(id_tithe: number): Promise<boolean>
}
