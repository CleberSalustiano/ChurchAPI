import { Request, Response } from "express";
import TreasurerRepository from "../../../../treasurer/infra/prisma/repositories/TreasureRepository";
import { ICreateOfferDTO } from "../../../dtos/ICreateOfferDTO";
import { IUpdateOfferDTO } from "../../../dtos/IUpdateOfferDTO";
import CreateNewOfferService from "../../../services/CreateNewOfferService";
import DeleteOfferService from "../../../services/DeleteOfferService";
import UpdateOfferService from "../../../services/UpdateOfferService";
import OfferRepository from "../../prisma/repositories/OfferRepository";

const offerRepository = new OfferRepository();
const treasurerRepository = new TreasurerRepository();

export default class OfferController {
  async index(request: Request, response: Response) {
    try {
      const offers = await offerRepository.findAll();

      return response.json({ offers });
    } catch (error) {
      if (error instanceof Error)
        return response.status(401).json({ error: error.message });
    }
  }

  async create(request: Request, response: Response) {
    try {
      const dataOffer: ICreateOfferDTO = request.body;

      const createNewOffer = new CreateNewOfferService(
        offerRepository,
        treasurerRepository
      );

      const offer = createNewOffer.execute(dataOffer);

      return response.json({ offer });
    } catch (error) {
      if (error instanceof Error)
        return response.status(401).json({ error: error.message });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { id_treasurer, value }: IUpdateOfferDTO = request.body;

      const updateOffer = new UpdateOfferService(
        offerRepository,
        treasurerRepository
      );

      const offer = await updateOffer.execute({
        id_offer: +id,
        id_treasurer,
        value,
      });

      return response.json({ offer });
    } catch (error) {
      if (error instanceof Error)
        return response.status(401).json({ error: error.message });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const deleteOffer = new DeleteOfferService(offerRepository);

      await deleteOffer.execute(+id);

      return response.status(201).json({});
    } catch (error) {
      if (error instanceof Error)
        return response.status(401).json({ error: error.message });
    }
  }
}
