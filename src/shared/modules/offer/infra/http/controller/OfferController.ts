import { Request, Response } from "express";
import {
  makeCreateOfferService,
  makeDeleteOfferService,
  makeUpdateOfferService,
  offerRepository,
} from "../../../../../container";

type ScopedRequest = Request & {
  user?: {
    access?: {
      scope: "GLOBAL" | "CHURCH";
      churchId: number;
    };
  };
};

export default class OfferController {
  async index(request: ScopedRequest, response: Response) {
    const access = request.user?.access;
    const offers =
      access?.scope === "CHURCH"
        ? await offerRepository.findAllByChurch(access.churchId)
        : await offerRepository.findAll();

    return response.json({ offers });
  }

  async create(request: Request, response: Response) {
    const { id_treasurer, value } = request.body;

    const createNewOffer = makeCreateOfferService();
    const offer = await createNewOffer.execute({ id_treasurer, value });

    return response.json({ offer });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { id_treasurer, value } = request.body;

    const updateOffer = makeUpdateOfferService();
    const offer = await updateOffer.execute({
      id_offer: +id,
      id_treasurer,
      value,
    });

    return response.json({ offer });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const deleteOffer = makeDeleteOfferService();
    await deleteOffer.execute(+id);

    return response.status(204).send();
  }
}
