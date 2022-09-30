import { IManager } from "../../../../../entities/IManager";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateManagerDTO } from "../../../dtos/ICreateManagerDTO";
import { IManagerRepository } from "../../../repositories/IManagerRepository";

export default class ManagerRepository implements IManagerRepository{
  public async create(dataManager: ICreateManagerDTO): Promise<IManager | undefined> {
    const manager = await prismaClient.manager.create({data: dataManager});

    return manager;
  }

  public async findAllbyChurch(id_church: number): Promise<IManager[] | undefined> {
    const managers = await prismaClient.manager.findMany({where: {id_church}})

    return managers;
  }
}