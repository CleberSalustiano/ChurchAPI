import { IManager } from "../../../../entities/IManager";
import { ICreateManagerDTO } from "../../dtos/ICreateManagerDTO";
import { IManagerRepository } from "../IManagerRepository";

export default class FakeManagerRepository implements IManagerRepository {
  private managers: IManager[] = [];

  public async create({
    id_church,
    id_member,
  }: ICreateManagerDTO): Promise<IManager | undefined> {
    const manager: IManager = {
      id_church,
      id_member,
      id: this.managers.length,
      dateStart: new Date(),
    };

    this.managers.push(manager);

    return manager;
  }


  public async findAllbyChurch(id_church: number): Promise<IManager[] | undefined> {
    const managers = this.managers.filter(member => member.id_church === id_church);

    return managers;
  }
}
