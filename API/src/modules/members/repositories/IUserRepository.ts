import { IUser } from "../../../entities/IUser";
import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { IUpdateUserLoginDTO } from "../dtos/IUpdateUserLoginDTO";
import { IUpdateUserPasswordDTO } from "../dtos/IUpdateUserPasswordDTO";

export interface IUserRepository {
  findById(id_user: number): Promise<IUser | undefined>
  findAll() : Promise<IUser[] | undefined>
  create(dataUser: ICreateUserDTO) : Promise<IUser | undefined>
  updateLogin(dataUser: IUpdateUserLoginDTO) : Promise<IUser | undefined>
  updatePassword(dataUser: IUpdateUserPasswordDTO) : Promise<IUser | undefined>
  delete(id_user: number): Promise <boolean>
  findByLogin(login: string): Promise<IUser | undefined>
}
