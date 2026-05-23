import { IUser } from "../../../../entities/IUser";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUpdateUserLoginDTO } from "../../dtos/IUpdateUserLoginDTO";
import { IUpdateUserPasswordDTO } from "../../dtos/IUpdateUserPasswordDTO";
import { IUserRepository } from "../IUserRepository";

export default class FakeUserRepository implements IUserRepository {
  private users: IUser[] = [];

  public async findById(id_user: number): Promise<IUser | undefined> {
    const user = this.users.find((user) => user.id === id_user);

    return user;
  }

  public async findAll(): Promise<IUser[] | undefined> {
    return this.users;
  }

  public async create({
    login,
    password,
  }: ICreateUserDTO): Promise<IUser | undefined> {
    const user: IUser = { id: this.users.length, login, password };

    this.users.push(user);

    return user;
  }

  public async delete(id_user: number): Promise<boolean> {
    const userIndex = this.users.findIndex((user) => (user.id === id_user));

    const user = this.users.splice(userIndex, 1);

    if (!user) return false;

    return true;
  }

  public async updateLogin({
    id_user,
    login,
  }: IUpdateUserLoginDTO): Promise<IUser | undefined> {
    const userIndex = this.users.findIndex((user) => (user.id === id_user));

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
    const userIndex = this.users.findIndex((user) => user.id === id_user);

    if (userIndex === -1) return undefined;

    const user = this.users[userIndex];
    user.password = password;

    this.users.splice(userIndex, 1, user);

    return user;
  }

  public async findByLogin(login: string): Promise<IUser | undefined> {
    const user = this.users.find((user) => user.login === login);
    return user;
  }
}
