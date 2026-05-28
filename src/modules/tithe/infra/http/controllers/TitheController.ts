import { Request, Response } from "express";
import {
  makeCreateTitheService,
  makeDeleteTitheService,
  makeUpdateTitheService,
  titheRepository,
} from "../../../../../shared/container";

type ScopedRequest = Request & {
  user?: {
    access?: {
      scope: "GLOBAL" | "CHURCH";
      churchId: number;
    };
  };
};

interface IRequestCreateTithe {
  id_church: number;
  id_member: number;
  reason: string;
  date: string;
  month: number;
  year: number;
  value: number;
  id_treasurer: number;
}

export default class TitheController {
  async create(request: Request, response: Response) {
    const { id_church, id_member, reason, date, month, year, value, id_treasurer }: IRequestCreateTithe =
      request.body;

    const createNewTithe = makeCreateTitheService();
    const tithe = await createNewTithe.execute({
      id_church,
      id_member,
      reason,
      date,
      month,
      year,
      value,
      id_treasurer,
    });

    return response.json({ tithe });
  }

  async index(request: ScopedRequest, response: Response) {
    const access = request.user?.access;
    const tithes =
      access?.scope === "CHURCH"
        ? await titheRepository.findAllByChurch(access.churchId)
        : await titheRepository.findAll();

    return response.json({ tithes });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { id_church, id_member, reason, date, month, year, value, id_treasurer }: IRequestCreateTithe =
      request.body;

    const updateTithe = makeUpdateTitheService();
    const tithe = await updateTithe.execute({
      id_tithe: +id,
      id_church,
      id_member,
      reason,
      date,
      month,
      year,
      value,
      id_treasurer,
    });

    return response.json({ tithe });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const deleteTithe = makeDeleteTitheService();
    await deleteTithe.execute(+id);

    return response.status(204).send();
  }
}
