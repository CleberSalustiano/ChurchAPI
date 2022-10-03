import { Request, Response } from "express";
import membersJsonCorrection from "../../../../../shared/utils/membersJsonCorrection";
import MemberRepository from "../../prisma/repositories/MemberRepository";

export default class MemberInChurchController {
  async index(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const memberRepository = new MemberRepository();

      const membersNoJson = await memberRepository.findAllbyChurch(+id);

      const members = membersJsonCorrection(membersNoJson);

      return response.json({ members });
    } catch (error) {
      if (error instanceof Error)
        return response.status(401).json({ error: error.message });
    }
  }
}
