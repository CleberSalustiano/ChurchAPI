import { Request, Response } from "express";
import { memberRepository } from "../../../../../shared/container";
import membersJsonCorrection from "../../../../../shared/utils/membersJsonCorrection";

export default class MemberInChurchController {
  async index(request: Request, response: Response) {
    const { id } = request.params;

    const membersNoJson = await memberRepository.findAllbyChurch(+id);

    const members = membersJsonCorrection(membersNoJson);

    return response.json({ members });
  }
}
