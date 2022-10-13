import { Request, Response } from "express";
import ManagerRepository from "../../prisma/repositories/ManagerRepository";

const managerRepository = new ManagerRepository();

export default class ManagerInChurchController {
  async index(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const managers = await managerRepository.findAllbyChurch(+id);

      return response.json({ managers });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(401).json({ error: error.message });
      }
    }
  }
}
