import { IUser } from "../../../../entities/IUser";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUpdateUserLoginDTO } from "../../dtos/IUpdateUserLoginDTO";
import { IUpdateUserPasswordDTO } from "../../dtos/IUpdateUserPasswordDTO";
import { IUserRepository } from "../IUserRepository";

export default class FakeUserRepository implements IUserRepository {
  private users: IUser[] = [];

  public async findById(id_user: number): Promise<IUser | undefined> {
    const user = this.users.find(
      (user) => user.id === id_user && !user.deletedAt
    );

    return user;
  }

  public async findAll(): Promise<IUser[] | undefined> {
    return this.users.filter((user) => !user.deletedAt);
  }

  public async create({
    login,
    password,
  }: ICreateUserDTO): Promise<IUser | undefined> {
    const user: IUser = {
      id: this.users.length,
      login,
      password,
      deletedAt: null,
    };

    this.users.push(user);

    return user;
  }

  public async delete(id_user: number): Promise<boolean> {
    const userIndex = this.users.findIndex(
      (user) => user.id === id_user && !user.deletedAt
    );

    if (userIndex === -1) return false;

    const user = this.users[userIndex];
    user.deletedAt = new Date();
    this.users.splice(userIndex, 1, user);

    return true;
  }

  public async updateLogin({
    id_user,
    login,
  }: IUpdateUserLoginDTO): Promise<IUser | undefined> {
    const userIndex = this.users.findIndex(
      (user) => user.id === id_user && !user.deletedAt
    );

    if(userIndex === -1) return undefined;
    const user = this.users[userIndex];
    user.login = login;

    this.users.splice(userIndex, 1, user);

    return user;
  }

  public async updatePassword({
    id_user,
    password,
  }: IUpdateUserPasswordDTO): Promise<IUser | undefined> {
    const userIndex = this.users.findIndex(
      (user) => user.id === id_user && !user.deletedAt
    );

    if (userIndex === -1) return undefined;

    const user = this.users[userIndex];
    user.password = password;

    this.users.splice(userIndex, 1, user);

    return user;
  }

  public async findByLogin(login: string): Promise<IUser | undefined> {
    const user = this.users.find(
      (user) => user.login === login && !user.deletedAt
    );
    return user;
  }
}
