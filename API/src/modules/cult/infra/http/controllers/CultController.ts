import { Request, Response } from "express";
import {
  cultRepository,
  makeCreateCultOfferService,
  makeCreateCultService,
  makeCreateRecurringCultSeriesService,
  makeDeleteCultOfferService,
  makeDeleteCultService,
  makeUpdateCultOfferService,
  makeUpdateCultService,
  makeUpdateRecurringCultSeriesService,
} from "../../../../../shared/container";

type ScopedRequest = Request & {
  user?: {
    access?: {
      scope: "GLOBAL" | "CHURCH";
      churchId: number;
    };
  };
};

interface IRequestCult {
  date: string;
  theme: string;
  id_church: number;
}

interface IRequestRecurringCult {
  date: string;
  theme: string;
  id_church: number;
  recurrence: {
    interval: number;
    until: string;
  };
}

interface IRequestCultOffer {
  value: number;
  id_treasurer: number;
}

export default class CultController {
  async create(request: Request, response: Response) {
    const { date, theme, id_church }: IRequestCult = request.body;

    const createNewCult = makeCreateCultService();
    const cult = await createNewCult.execute({ date, theme, id_church });

    return response.json({ cult });
  }

  async index(request: ScopedRequest, response: Response) {
    const access = request.user?.access;
    const cults =
      access?.scope === "CHURCH"
        ? await cultRepository.findAllByChurch(access.churchId)
        : await cultRepository.findAll();

    return response.json({ cults });
  }

  async createRecurring(request: Request, response: Response) {
    const { date, id_church, recurrence, theme }: IRequestRecurringCult =
      request.body;

    const createRecurringCultSeries = makeCreateRecurringCultSeriesService();
    const cults = await createRecurringCultSeries.execute({
      date,
      id_church,
      recurrence,
      theme,
    });

    return response.json({ cults });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { date, theme, id_church }: IRequestCult = request.body;

    const updateCult = makeUpdateCultService();
    const cult = await updateCult.execute({
      id_cult: +id,
      date,
      theme,
      id_church,
    });

    return response.json({ cult });
  }

  async updateSeries(request: Request, response: Response) {
    const { id } = request.params;
    const { id_church, theme }: Pick<IRequestCult, "id_church" | "theme"> =
      request.body;

    const updateRecurringCultSeries = makeUpdateRecurringCultSeriesService();
    const cults = await updateRecurringCultSeries.execute({
      id_cult: +id,
      id_church,
      theme,
    });

    return response.json({ cults });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const deleteCult = makeDeleteCultService();
    await deleteCult.execute(+id);

    return response.status(204).send();
  }

  async createOffer(request: Request, response: Response) {
    const { id } = request.params;
    const { id_treasurer, value }: IRequestCultOffer = request.body;

    const createCultOffer = makeCreateCultOfferService();
    const cultOffer = await createCultOffer.execute({
      id_cult: +id,
      id_treasurer,
      value,
    });

    return response.json({ cultOffer });
  }

  async updateOffer(request: Request, response: Response) {
    const { id, cultOfferId } = request.params;
    const { id_treasurer, value }: IRequestCultOffer = request.body;

    const updateCultOffer = makeUpdateCultOfferService();
    const cultOffer = await updateCultOffer.execute({
      id_cult: +id,
      id_cult_offer: +cultOfferId,
      id_treasurer,
      value,
    });

    return response.json({ cultOffer });
  }

  async deleteOffer(request: Request, response: Response) {
    const { id, cultOfferId } = request.params;

    const deleteCultOffer = makeDeleteCultOfferService();
    const cultOffer = await deleteCultOffer.execute(+id, +cultOfferId);

    return response.json({ cultOffer });
  }
}
