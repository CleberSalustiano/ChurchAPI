import { IUser } from "../../../../../entities/IUser";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateUserDTO } from "../../../dtos/ICreateUserDTO";
import { IUpdateUserDTO } from "../../../dtos/IUpdateUserDTO";
import { IUserRepository } from "../../../repositories/IUserRepository";

export class UserRepository implements IUserRepository {
  async findById(id_user: number): Promise<IUser | undefined> {
    const user = await prismaClient.user.findFirst({ where: { id: id_user } });
    return user ? user : undefined;
  }
  async findAll(): Promise<IUser[] | undefined> {
    const users = await prismaClient.user.findMany();
    return users;
  }
  async create({ login, password }: ICreateUserDTO): Promise<IUser | undefined> {
    const user = await prismaClient.user.create({
      data: { login, password },
    });
    return user;
  }
  async update({
    id_user,
    login,
    password,
  }: IUpdateUserDTO): Promise<IUser | undefined> {
    const user = await prismaClient.user.update({
      where: { id: id_user },
      data: { login, password },
    });
    return user;
  }
  async delete(id_user: number): Promise<boolean> {
    const user = await prismaClient.user.delete({ where: { id: id_user } });
    return user ? true : false;
  }

  async findByLogin(login: string): Promise<IUser | undefined> {
    const user = await prismaClient.user.findFirst({where: {login}});
    return user ? user : undefined;
  }
}
