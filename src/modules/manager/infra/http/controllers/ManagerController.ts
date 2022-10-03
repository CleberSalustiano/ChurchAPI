import { Request, Response } from "express";
import ChurchRepository from "../../../../churchs/infra/prisma/repositories/ChurchRepository";
import MemberRepository from "../../../../members/infra/prisma/repositories/MemberRepository";
import { ICreateManagerDTO } from "../../../dtos/ICreateManagerDTO";
import { IUpdateManagerDTO } from "../../../dtos/IUploadManagerDTO";
import CreateNewManagerService from "../../../services/CreateNewManageService";
import UpdateManagerService from "../../../services/UpdateManagerService";
import ManagerRepository from "../../prisma/repositories/ManagerRepository";

export default class ManagerController {
  async create(request: Request, response: Response) {
    try {
      const { id_church, id_member }: ICreateManagerDTO = request.body;

      const memberRepository = new MemberRepository();
      const churchRepository = new ChurchRepository();
      const managerRepository = new ManagerRepository();
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
      const managerRepository = new ManagerRepository();

      const managers = await managerRepository.findAll();

      return response.json({ managers });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(401).json({ error: error.message });
      }
    }
  }

  async update(request: Request, response: Response) {
    try {
      const {id} = request.params

      const {id_church, id_member} = request.body
      
      const memberRepository = new MemberRepository();
      const managerRepository = new ManagerRepository();
      const churchRepository = new ChurchRepository();

      const updateManager = new UpdateManagerService(memberRepository, churchRepository, managerRepository);

      const manager = await updateManager.execute({id_church, id_manager: +id, id_member});

      return response.json({manager});
    } catch (error) {
      if (error instanceof Error) {
        return response.status(401).json({ error: error.message });
      }
    }
  }
}
