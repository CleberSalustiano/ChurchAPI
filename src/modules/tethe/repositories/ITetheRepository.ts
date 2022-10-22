import { ITethe } from "../../../entities/ITethe";
import { ICreateTetheDTO } from "../dtos/ICreateTetheDTO";
import { IUpdateTetheDTO } from "../dtos/IUpdateTetheDTO";

export interface ITetheRepository {
  create(dataTethe: ICreateTetheDTO) : Promise<ITethe | undefined>
  findAll() : Promise<ITethe[] | undefined>
  findById(id_tethe: number) : Promise<ITethe | undefined>
  update(dataTethe: IUpdateTetheDTO) : Promise<ITethe | undefined>
  delete(id_tethe: number): Promise<boolean>
}