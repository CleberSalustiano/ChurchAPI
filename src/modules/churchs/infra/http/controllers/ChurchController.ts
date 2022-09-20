import { Request, Response } from "express";
import { ICreateChurchDTO } from "../../../dtos/ICreateChurchDTO";
import CreateNewChurchService from "../../../services/CreateNewChurchService";
import ChurchRepository from "../../prisma/repositories/ChurchRepository";

export default class ChurchController {

  async create(request: Request, response: Response) {
    const data: ICreateChurchDTO = request.body;

    const churchRepository = new ChurchRepository();
    const createNewChurch = new CreateNewChurchService(churchRepository);
    const church = await createNewChurch.execute(data);

    return response.json({ church });
  }
}