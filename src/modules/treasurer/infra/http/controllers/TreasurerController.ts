import { Request, Response } from "express";
import MemberRepository from "../../../../members/infra/prisma/repositories/MemberRepository";
import CreateNewTreasurerService from "../../../services/CreateNewTreasureService";
import TreasurerRepository from "../../prisma/repositories/TreasureRepository";

export default class TreasurerController {
  async create(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const memberRepository = new MemberRepository();
      const treasurerRepository = new TreasurerRepository();

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
      const treasurerRepository = new TreasurerRepository();

      const treasurers = await treasurerRepository.findAll();

      return response.json({ treasurers });
    } catch (error) {
      if (error instanceof Error)
        return response.status(401).json({ error: error.message });
    }
  }
}
