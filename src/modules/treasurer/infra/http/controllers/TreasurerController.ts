import { Request, Response } from "express";
import MemberRepository from "../../../../members/infra/prisma/repositories/MemberRepository";
import CreateNewTreasurerService from "../../../services/CreateNewTreasureService";
import DeleteTreasurerService from "../../../services/DeleteTreasurerService";
import UpdateTreasurerService from "../../../services/UpdateTreasurerService";
import TreasurerRepository from "../../prisma/repositories/TreasureRepository";

const memberRepository = new MemberRepository();
const treasurerRepository = new TreasurerRepository();

export default class TreasurerController {
  async create(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const createNewTreasurer = new CreateNewTreasurerService(
        memberRepository,
        treasurerRepository
      );

      const treasurer = await createNewTreasurer.execute(+id);

      if (treasurer?.member) {
        // @ts-ignore
        treasurer.member.cpf = treasurer.member.cpf.toString();
      }

      return response.json({ treasurer });
    } catch (error) {
      if (error instanceof Error)
        return response.status(401).json({ error: error.message });
    }
  }

  async index(request: Request, response: Response) {
    try {
      const treasurers = await treasurerRepository.findAllActive();

      return response.json({ treasurers });
    } catch (error) {
      if (error instanceof Error)
        return response.status(401).json({ error: error.message });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { id_member } = request.body;

      const updateTreasurer = new UpdateTreasurerService(
        memberRepository,
        treasurerRepository
      );
      const treasurer = await updateTreasurer.execute({
        id_member,
        id_treasurer: +id,
      });

      return response.json({ treasurer });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(401).json({ error: error.message });
      }
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const deleteTreasurer = new DeleteTreasurerService(treasurerRepository);

      await deleteTreasurer.execute(+id);

      return response.status(201).json({});
    } catch (error) {
      if (error instanceof Error) {
        return response.status(401).json({ error: error.message });
      }
    }
  }
}
