import { Request, Response } from "express";
import ChurchRepository from "../../../../churchs/infra/prisma/repositories/ChurchRepository";
import CreateNewMemberService from "../../../services/CreateNewMemberService";
import MemberRepository from "../../prisma/repositories/MemberRepository";

interface IRequest {
  id_church: number;
  name: string;
  birth_date: Date;
  batism_date: Date;
  titleChurch: string;
  cpf: bigint;
  rg: number;
  login: string;
  email: string;
  password: string;
}

export default class MemberController {
  async create(request: Request, response: Response) {
    try {
      const {
        batism_date,
        birth_date,
        cpf,
        email,
        login,
        name,
        password,
        rg,
        titleChurch,
        id_church,
      }: IRequest = request.body;

      const memberRepository = new MemberRepository();
      const churchRepository = new ChurchRepository();
      const createNewMember = new CreateNewMemberService(
        memberRepository,
        churchRepository
      );

      let member = await createNewMember.execute({
        batism_date,
        birth_date,
        cpf,
        email,
        login,
        name,
        password,
        rg,
        titleChurch,
        id_church,
      });

      if (member) member.cpf = +member.cpf.toString();

      return response.json({ member });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(401).json({ error: error.message });
      }
    }
  }

  async index(request: Request, response: Response) {
    const memberRepository = new MemberRepository();

    const members = await memberRepository.findAll();

    return response.json({ members });
  }
}
