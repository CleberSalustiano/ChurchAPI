import { Request, Response } from "express";
import ChurchRepository from "../../../../churchs/infra/prisma/repositories/ChurchRepository";
import MemberRepository from "../../../../members/infra/prisma/repositories/MemberRepository";
import { ICreateManagerDTO } from "../../../dtos/ICreateManagerDTO";
import CreateNewManagerService from "../../../services/CreateNewManageService";
import DeleteManagerService from "../../../services/DeleteManagerService";
import UpdateManagerService from "../../../services/UpdateManagerService";
import ManagerRepository from "../../prisma/repositories/ManagerRepository";

const memberRepository = new MemberRepository();
const churchRepository = new ChurchRepository();
const managerRepository = new ManagerRepository();

export default class ManagerController {
  async create(request: Request, response: Response) {
    try {
      const { id_church, id_member }: ICreateManagerDTO = request.body;

      const createNewManager = new CreateNewManagerService(
        memberRepository,
        churchRepository,
        managerRepository
      );

      const manager = await createNewManager.execute({ id_church, id_member });

      return response.json({ manager });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(401).json({ error: error.message });
      }
    }
  }

  async index(request: Request, response: Response) {
    try {
      const managers = await managerRepository.findAllActive();

      return response.json({ managers });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(401).json({ error: error.message });
      }
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const { id_church, id_member } = request.body;

      const updateManager = new UpdateManagerService(
        memberRepository,
        churchRepository,
        managerRepository
      );

      const manager = await updateManager.execute({
        id_church,
        id_manager: +id,
        id_member,
      });

      return response.json({ manager });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(401).json({ error: error.message });
      }
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const deleteManager = new DeleteManagerService(managerRepository);

      const manager = await deleteManager.execute(+id);

      return response.status(201).json({});
    } catch (error) {
      if (error instanceof Error)
        return response.status(401).json({ error: error.message });
    }
  }
}
