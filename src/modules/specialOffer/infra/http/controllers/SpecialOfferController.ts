import { Request, Response } from "express";
import OfferRepository from "../../../../../shared/modules/offer/infra/prisma/repositories/OfferRepository";
import ChurchRepository from "../../../../churchs/infra/prisma/repositories/ChurchRepository";
import MemberRepository from "../../../../members/infra/prisma/repositories/MemberRepository";
import TreasurerRepository from "../../../../treasurer/infra/prisma/repositories/TreasureRepository";
import CreateNewSpecialOfferService from "../../../services/CreateNewSpecialOfferService";
import SpecialOfferRepository from "../../prisma/repositories/SpecialOfferRepository";

const offerRepository = new OfferRepository();
const specialOfferRepository = new SpecialOfferRepository();
const treasurerRepository = new TreasurerRepository();
const churchRepository = new ChurchRepository();
const memberRepository = new MemberRepository();

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
    try {
      const {
        id_church,
        id_member,
        id_treasurer,
        value,
        reason,
        date,
      }: IRequestCreate = request.body;

      const createNewSpecialOfferService = new CreateNewSpecialOfferService(
        offerRepository,
        specialOfferRepository,
        treasurerRepository,
        churchRepository,
        memberRepository
      );

      const newSpecialOfferService = await createNewSpecialOfferService.execute(
        { date, id_church, id_member, reason, id_treasurer, value }
      );

      return response.send({ newSpecialOfferService });
    } catch (err) {
      if (err instanceof Error) {
        return response.status(401).json({ error: err.message });
      }
    }
  }

  async index(request: Request, response: Response) {
    try {
      const specialOffers = await specialOfferRepository.findAll();

      return response.json({ specialOffers });
    } catch (err) {
      if (err instanceof Error) {
        return response.status(401).json({ error: err.message });
      }
    }
  }
}
