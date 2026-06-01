import { Request, Response } from "express";
import {
  makeCreateManagerService,
  makeDeleteManagerService,
  makeReplaceManagerService,
  makeUpdateManagerService,
  managerRepository,
} from "../../../../../shared/container";
import { ICreateManagerDTO } from "../../../dtos/ICreateManagerDTO";

type ScopedRequest = Request & {
  user?: {
    access?: {
      scope: "GLOBAL" | "CHURCH";
      churchId: number;
    };
  };
};

export default class ManagerController {
  async create(request: Request, response: Response) {
    const { id_church, id_member }: ICreateManagerDTO = request.body;

    const createNewManager = makeCreateManagerService();

    const manager = await createNewManager.execute({ id_church, id_member });

    return response.json({ manager });
  }

  async index(request: ScopedRequest, response: Response) {
    const access = request.user?.access;
    const managers =
      access?.scope === "CHURCH"
        ? await managerRepository.findAllbyChurch(access.churchId)
        : await managerRepository.findAllActive();

    return response.json({ managers });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;

    const { id_church, id_member } = request.body;

    const updateManager = makeUpdateManagerService();

    const manager = await updateManager.execute({
      id_church,
      id_manager: +id,
      id_member,
    });

    return response.json({ manager });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const deleteManager = makeDeleteManagerService();

    await deleteManager.execute(+id);

    return response.status(204).send();
  }

  async replace(request: Request, response: Response) {
    const { id } = request.params;
    const { id_member } = request.body;

    const replaceManager = makeReplaceManagerService();
    const result = await replaceManager.execute({
      id_manager: +id,
      id_member,
    });

    return response.json(result);
  }
}
