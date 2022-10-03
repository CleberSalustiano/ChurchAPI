import { IManager } from "../../../../entities/IManager";
import { IUpdateChurchDTO } from "../../../churchs/dtos/IUpdateChurchDTO";
import { ICreateManagerDTO } from "../../dtos/ICreateManagerDTO";
import { IUpdateManagerDTO } from "../../dtos/IUploadManagerDTO";
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

  public async findById(id_manager: number): Promise<IManager | undefined> {
    const manager = this.managers.find(manager => manager.id === id_manager);

    return manager;
  }

  public async update({id_church,id_manager,id_member}: IUpdateManagerDTO): Promise<IManager | undefined> {
    const managerIndex = this.managers.findIndex(manager => manager.id === id_manager);
    
    if(managerIndex === -1)
      return undefined
    const manager = this.managers[managerIndex];
    manager.id_church = id_church;
    manager.id_member = id_member;

		this.managers.splice(managerIndex, 1, manager);

    return manager;    
  }

  public async delete(id_manager: number): Promise<boolean> {
    const managerIndex = this.managers.findIndex(
			(manager) => manager.id === id_manager
		);

		if (managerIndex === -1) return false;

		const manager = this.managers.splice(managerIndex, 1);

		if (manager) return true;

		return false;  }
}
