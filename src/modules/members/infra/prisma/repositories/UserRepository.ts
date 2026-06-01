import { IUser } from "../../../../../entities/IUser";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateUserDTO } from "../../../dtos/ICreateUserDTO";
import { IUpdateUserLoginDTO } from "../../../dtos/IUpdateUserLoginDTO";
import { IUpdateUserPasswordDTO } from "../../../dtos/IUpdateUserPasswordDTO";
import { IUserRepository } from "../../../repositories/IUserRepository";

export class UserRepository implements IUserRepository {
  async findById(id_user: number): Promise<IUser | undefined> {
    const user = await prismaClient.user.findFirst({
      where: { id: id_user, deletedAt: null },
    });
    return user ? user : undefined;
  }
  async findAll(): Promise<IUser[] | undefined> {
    const users = await prismaClient.user.findMany({
      where: { deletedAt: null },
    });
    return users;
  }
  async create({ login, password }: ICreateUserDTO): Promise<IUser | undefined> {
    const user = await prismaClient.user.create({
      data: { login, password },
    });
    return user;
  }
  async updateLogin({
    id_user,
    login,
  }: IUpdateUserLoginDTO): Promise<IUser | undefined> {
    const existingUser = await this.findById(id_user);

    if (!existingUser) return undefined;

    const user = await prismaClient.user.update({
      where: { id: id_user },
      data: { login },
    });
    return user;
  }
  async updatePassword({
    id_user,
    password,
  }: IUpdateUserPasswordDTO): Promise<IUser | undefined> {
    const existingUser = await this.findById(id_user);

    if (!existingUser) return undefined;

    const user = await prismaClient.user.update({
      where: { id: id_user },
      data: { password },
    });
    return user;
  }
  async delete(id_user: number): Promise<boolean> {
    const existingUser = await this.findById(id_user);

    if (!existingUser) return false;

    const user = await prismaClient.user.update({
      where: { id: id_user },
      data: { deletedAt: new Date() },
    });
    return user ? true : false;
  }

  async findByLogin(login: string): Promise<IUser | undefined> {
    const user = await prismaClient.user.findFirst({
      where: { login, deletedAt: null },
    });
    return user ? user : undefined;
  }
}
