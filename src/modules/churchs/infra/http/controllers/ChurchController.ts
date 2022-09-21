import { Request, Response } from "express";
import { ICreateChurchDTO } from "../../../dtos/ICreateChurchDTO";
import CreateNewChurchService from "../../../services/CreateNewChurchService";
import ChurchRepository from "../../prisma/repositories/ChurchRepository";
import LocationRepository from "../../prisma/repositories/LocationRepository";

interface IRequestChurchLocationParams {
  date: Date;
  street: string;
  district: string;
  city: string;
  state: string;
  country: string;
  cep: number
}

export default class ChurchController {

  async create(request: Request, response: Response) {
    try {
      const { date, street, cep, city, country, district, state }: IRequestChurchLocationParams = request.body;

      const churchRepository = new ChurchRepository();
      const locationRepository = new LocationRepository();
      const createNewChurch = new CreateNewChurchService(churchRepository, locationRepository);
      const church = await createNewChurch.execute({ date, id_location: -1 }, { cep, city, country, district, state, street });

      return response.json({ church });
    } catch (error) {
      if (error instanceof Error)
        return response.status(400).json({ error: error.message });
    }
  }

  async index(request: Request, response: Response) {
    const churchRepository = new ChurchRepository();

    const churchs = await churchRepository.findAll();

    return response.json({ churchs });
  }
}