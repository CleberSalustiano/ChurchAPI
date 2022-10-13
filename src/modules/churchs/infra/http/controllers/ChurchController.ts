import { Request, Response } from "express";
import CreateNewChurchService from "../../../services/CreateNewChurchService";
import DeleteChurchService from "../../../services/DeleteChurchService";
import UpdateChurchService from "../../../services/UpdateChurchService";
import ChurchRepository from "../../prisma/repositories/ChurchRepository";
import LocationRepository from "../../prisma/repositories/LocationRepository";

interface IRequestChurchLocationParams {
  date: Date;
  street: string;
  district: string;
  city: string;
  state: string;
  country: string;
  cep: number;
}

const churchRepository = new ChurchRepository();
const locationRepository = new LocationRepository();

export default class ChurchController {
  async create(request: Request, response: Response) {
    try {
      const {
        date,
        street,
        cep,
        city,
        country,
        district,
        state,
      }: IRequestChurchLocationParams = request.body;

      const createNewChurch = new CreateNewChurchService(
        churchRepository,
        locationRepository
      );
      const church = await createNewChurch.execute(
        { date, id_location: -1 },
        { cep, city, country, district, state, street }
      );

      return response.json({ church });
    } catch (error) {
      if (error instanceof Error)
        return response.status(400).json({ error: error.message });
    }
  }

  async index(request: Request, response: Response) {
    const churchs = await churchRepository.findAll();

    return response.json({ churchs });
  }

  async delete(request: Request, response: Response) {
    try {
      const { id_church } = request.params;

      const deleteChurch = new DeleteChurchService(
        churchRepository,
        locationRepository
      );
      await deleteChurch.execute(+id_church);

      return response.status(201).json({});
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { id_church } = request.params;

      const {
        date,
        street,
        cep,
        city,
        country,
        district,
        state,
      }: IRequestChurchLocationParams = request.body;

      const updateChurch = new UpdateChurchService(
        churchRepository,
        locationRepository
      );
      const newChurch = await updateChurch.execute(
        { id_church: +id_church, date },
        { street, cep, city, country, district, state, id_location: 0 }
      );

      return response.json({ church: newChurch });
    } catch (error) {
      if (error instanceof Error)
        return response.status(400).json({ error: error.message });
    }
  }
}
