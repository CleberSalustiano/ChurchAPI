import { IUser } from "../../../../entities/IUser";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUpdateUserDTO } from "../../dtos/IUpdateUserDTO";
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
    password,
  }: ICreateUserDTO): Promise<IUser | undefined> {
    const user: IUser = { id: this.users.length, password };

    return user;
  }

  public async delete(id_user: number): Promise<boolean> {
    const userIndex = this.users.findIndex((user) => (user.id === id_user));

    const user = this.users.splice(userIndex, 1);

    if (!user) return false;

    return true;
  }

  public async update({
    id_user,
    password,
  }: IUpdateUserDTO): Promise<IUser | undefined> {
    const userIndex = this.users.findIndex((user) => (user.id === id_user));

    if(userIndex === -1) return undefined;
    const user = this.users[userIndex];
    user.password = password;

    this.users.splice(userIndex, 1, user);

    return user;
  }
}
