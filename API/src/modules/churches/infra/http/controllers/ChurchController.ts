import { Request, Response } from "express";
import {
  churchRepository,
  makeCreateChurchService,
  makeCreateChurchWithInitialManagerService,
  makeDeactivateChurchService,
  makeDeleteChurchService,
  makeReactivateChurchService,
  makeUpdateChurchService,
} from "../../../../../shared/container";
import { ChurchType } from "../../../../../entities/IChurch";

type ScopedRequest = Request & {
  user?: {
    access?: {
      scope: "GLOBAL" | "CHURCH";
      churchId: number;
    };
  };
};

interface IRequestChurchLocationParams {
  date: string;
  street: string;
  district: string;
  city: string;
  state: string;
  country: string;
  cep: number;
  type?: ChurchType;
}

export default class ChurchController {
  async create(request: Request, response: Response) {
    const {
      date,
      street,
      cep,
      city,
      country,
      district,
      state,
      type,
    }: IRequestChurchLocationParams = request.body;

    const createNewChurch = makeCreateChurchService();
    const church = await createNewChurch.execute(
      { date, id_location: -1, type },
      { cep, city, country, district, state, street }
    );

    return response.json({ church });
  }

  async index(request: ScopedRequest, response: Response) {
    const access = request.user?.access;

    if (access?.scope === "CHURCH") {
      const church = await churchRepository.findById(access.churchId);

      return response.json({ churches: church ? [church] : [] });
    }

    const churches = await churchRepository.findAll();

    return response.json({ churches });
  }

  async createStructured(request: Request, response: Response) {
    const createChurchWithInitialManager = makeCreateChurchWithInitialManagerService();
    const result = await createChurchWithInitialManager.execute(request.body);

    return response.json(result);
  }

  async delete(request: Request, response: Response) {
    const { id_church } = request.params;

    const deleteChurch = makeDeleteChurchService();
    await deleteChurch.execute(+id_church);

    return response.status(204).send();
  }

  async deactivate(request: Request, response: Response) {
    const { id_church } = request.params;

    const deactivateChurch = makeDeactivateChurchService();
    const church = await deactivateChurch.execute(+id_church);

    return response.json({ church });
  }

  async reactivate(request: Request, response: Response) {
    const { id_church } = request.params;

    const reactivateChurch = makeReactivateChurchService();
    const church = await reactivateChurch.execute(+id_church);

    return response.json({ church });
  }

  async update(request: Request, response: Response) {
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

    const updateChurch = makeUpdateChurchService();
    const newChurch = await updateChurch.execute(
      { id_church: +id_church, date },
      { street, cep, city, country, district, state, id_location: 0 }
    );

    return response.json({ church: newChurch });
  }
}
