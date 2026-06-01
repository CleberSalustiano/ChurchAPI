import { Request, Response } from "express";
import { managerRepository } from "../../../../../shared/container";

export default class ManagerInChurchController {
  async index(request: Request, response: Response) {
    const { id } = request.params;

    const managers = await managerRepository.findAllbyChurch(+id);

    return response.json({ managers });
  }
}
