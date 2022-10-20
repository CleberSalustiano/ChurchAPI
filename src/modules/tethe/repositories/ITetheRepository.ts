import { ITethe } from "../../../entities/ITethe";
import { ICreateTetheDTO } from "../dtos/ICreateTetheDTO";

export interface ITetheRepository {
  create(dataTethe: ICreateTetheDTO) : Promise<ITethe | undefined>
  findAll() : Promise<ITethe[] | undefined>
  findById(id_tethe: number) : Promise<ITethe | undefined>
}