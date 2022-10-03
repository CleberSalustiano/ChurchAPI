import { IManager } from "../../../../../entities/IManager";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateManagerDTO } from "../../../dtos/ICreateManagerDTO";
import { IUpdateManagerDTO } from "../../../dtos/IUploadManagerDTO";
import { IManagerRepository } from "../../../repositories/IManagerRepository";

export default class ManagerRepository implements IManagerRepository {
  public async create(
    dataManager: ICreateManagerDTO
  ): Promise<IManager | undefined> {
    const manager = await prismaClient.manager.create({ data: dataManager });

    return manager;
  }

  public async findAllbyChurch(
    id_church: number
  ): Promise<IManager[] | undefined> {
    const managers = await prismaClient.manager.findMany({
      where: { id_church },
    });

    return managers;
  }

  public async findAll(): Promise<IManager[] | undefined> {
    const managers = await prismaClient.manager.findMany();

    return managers;
  }

  public async findById(id_manager: number): Promise<IManager | undefined> {
    const manager = await prismaClient.manager.findFirst({
      where: { id: id_manager },
    });

    if (!manager) return undefined;
    return manager;
  }

  public async delete(id_manager: number): Promise<boolean> {
    const managerExists = await prismaClient.manager.findFirst({
      where: { id: id_manager },
    });

    if (!managerExists) return false;

    const manager = await prismaClient.manager.delete({
      where: { id: id_manager },
    });

    if (!manager) return false;

    return true;
  }

  public async update(
    dataManager: IUpdateManagerDTO
  ): Promise<IManager | undefined> {
    const managerExists = await prismaClient.manager.findFirst({
      where: { id: dataManager.id_manager },
    });

    if (!managerExists) return undefined;

    const manager = await prismaClient.manager.update({
      where: { id: dataManager.id_manager },
      data: dataManager,
    });

    if (!manager) return undefined;

    return manager;
  }

  public async findByMember(id_member: number): Promise<IManager | undefined> {
    const manager = await prismaClient.manager.findFirst({
      where: {id_member}
    })

    if (!manager) return undefined
    
    return manager
  }
}
