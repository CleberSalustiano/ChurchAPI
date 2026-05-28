import { Request, Response } from "express";
import {
  costRepository,
  makeCreateCostService,
  makeDeleteCostService,
  makeUpdateCostService,
} from "../../../../../shared/container";

type ScopedRequest = Request & {
  user?: {
    access?: {
      scope: "GLOBAL" | "CHURCH";
      churchId: number;
    };
  };
};

interface IRequestCostCreate {
  value: number;
  date: string;
  description: string;
  id_church: number;
}

interface IRequestCostUpdate {
  value: number;
  date: string;
  description: string;
}

export default class CostController {
  async create(request: Request, response: Response) {
    const { value, date, description, id_church }: IRequestCostCreate =
      request.body;

    const createNewCost = makeCreateCostService();
    const cost = await createNewCost.execute({
      value,
      date,
      description,
      id_church,
    });

    return response.json({ cost });
  }

  async index(request: ScopedRequest, response: Response) {
    const access = request.user?.access;
    const costs =
      access?.scope === "CHURCH"
        ? await costRepository.findAllByChurch(access.churchId)
        : await costRepository.findAll();

    return response.json({ costs });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { value, date, description }: IRequestCostUpdate = request.body;

    const updateCost = makeUpdateCostService();
    const cost = await updateCost.execute({
      id_cost: +id,
      value,
      date,
      description,
    });

    return response.json({ cost });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const deleteCost = makeDeleteCostService();
    await deleteCost.execute(+id);

    return response.status(204).send();
  }
}
