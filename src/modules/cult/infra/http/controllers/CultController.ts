import { Request, Response } from "express";
import {
  cultRepository,
  makeCreateCultService,
  makeDeleteCultService,
  makeUpdateCultService,
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

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const deleteCult = makeDeleteCultService();
    await deleteCult.execute(+id);

    return response.status(204).send();
  }
}
