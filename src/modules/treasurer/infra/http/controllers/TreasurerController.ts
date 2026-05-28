import { Request, Response } from "express";
import {
  makeCreateTreasurerService,
  makeDeleteTreasurerService,
  makeUpdateTreasurerService,
  treasurerRepository,
} from "../../../../../shared/container";

type ScopedRequest = Request & {
  user?: {
    access?: {
      scope: "GLOBAL" | "CHURCH";
      churchId: number;
    };
  };
};

export default class TreasurerController {
  async create(request: Request, response: Response) {
    const { id } = request.params;

    const createNewTreasurer = makeCreateTreasurerService();

    const treasurer = await createNewTreasurer.execute(+id);

    const treasurerResponse =
      treasurer?.member
        ? {
            ...treasurer,
            member: {
              ...treasurer.member,
              cpf: treasurer.member.cpf.toString(),
            },
          }
        : treasurer;

    return response.json({ treasurer: treasurerResponse });
  }

  async index(request: ScopedRequest, response: Response) {
    const access = request.user?.access;
    const treasurers =
      access?.scope === "CHURCH"
        ? await treasurerRepository.findAllActiveByChurch(access.churchId)
        : await treasurerRepository.findAllActive();

    return response.json({ treasurers });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { id_member } = request.body;

    const updateTreasurer = makeUpdateTreasurerService();
    const treasurer = await updateTreasurer.execute({
      id_member,
      id_treasurer: +id,
    });

    return response.json({ treasurer });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const deleteTreasurer = makeDeleteTreasurerService();

    await deleteTreasurer.execute(+id);

    return response.status(204).send();
  }
}
