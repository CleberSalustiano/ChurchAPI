import { IUser } from "../../../entities/IUser";
import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { IUpdateUserDTO } from "../dtos/IUpdateUserDTO";

export interface IUserRepository {
  findById(id_user: number): Promise<IUser | undefined>
  findAll() : Promise<IUser[] | undefined>
  create(dataUser: ICreateUserDTO) : Promise<IUser | undefined>
  update(dataUser: IUpdateUserDTO) : Promise<IUser | undefined>
  delete(id_user: number): Promise <boolean>
}