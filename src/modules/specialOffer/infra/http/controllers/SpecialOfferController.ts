import { Request, Response } from "express";
import {
  makeCreateSpecialOfferService,
  specialOfferRepository,
} from "../../../../../shared/container";

type ScopedRequest = Request & {
  user?: {
    access?: {
      scope: "GLOBAL" | "CHURCH";
      churchId: number;
    };
  };
};

interface IRequestCreate {
  id_church: number;
  id_member: number;
  id_treasurer: number;
  value: number;
  reason: string;
  date: string;
}

export default class SpecialOfferController {
  async create(request: Request, response: Response) {
    const {
      id_church,
      id_member,
      id_treasurer,
      value,
      reason,
      date,
    }: IRequestCreate = request.body;

    const createNewSpecialOfferService = makeCreateSpecialOfferService();

    const specialOffer = await createNewSpecialOfferService.execute(
      { date, id_church, id_member, reason, id_treasurer, value }
    );

    return response.json({ specialOffer });
  }

  async index(request: ScopedRequest, response: Response) {
    const access = request.user?.access;
    const specialOffers =
      access?.scope === "CHURCH"
        ? await specialOfferRepository.findAllByChurch(access.churchId)
        : await specialOfferRepository.findAll();

    return response.json({ specialOffers });
  }
}
