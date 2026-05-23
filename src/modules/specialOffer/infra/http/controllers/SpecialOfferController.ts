import { Request, Response } from "express";
import {
  makeCreateSpecialOfferService,
  specialOfferRepository,
} from "../../../../../shared/container";

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

    const newSpecialOfferService = await createNewSpecialOfferService.execute(
      { date, id_church, id_member, reason, id_treasurer, value }
    );

    return response.send({ newSpecialOfferService });
  }

  async index(request: Request, response: Response) {
    const specialOffers = await specialOfferRepository.findAll();

    return response.json({ specialOffers });
  }
}
