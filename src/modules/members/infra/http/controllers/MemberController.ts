import { Request, Response } from "express";
import membersJsonCorrection from "../../../../../shared/utils/membersJsonCorrection";
import ChurchRepository from "../../../../churchs/infra/prisma/repositories/ChurchRepository";
import CreateNewMemberService from "../../../services/CreateNewMemberService";
import UpdateNewMemberService from "../../../services/UpdateMemberService";
import MemberRepository from "../../prisma/repositories/MemberRepository";
import DeleteMemberService from "../../../services/DeleteMemberService";

interface IRequestCreate {
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

interface IRequestUpdate {
  id_church: number;
  name: string;
  birth_date: Date;
  batism_date: Date;
  titleChurch: string;
  cpf?: bigint;
  rg: number;
  login: string;
  email: string;
  password: string;
  id_member: number;
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
      }: IRequestCreate = request.body;

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

    const membersNoJson = await memberRepository.findAll();

    const members = membersJsonCorrection(membersNoJson);

    return response.json({ members });
  }

  async update(request: Request, response: Response) {
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
      }: IRequestUpdate = request.body;

      const {id} = request.params

      const memberRepository = new MemberRepository();
      const churchRepository = new ChurchRepository();
      const updateNewMember = new UpdateNewMemberService(
        memberRepository,
        churchRepository
      );

      let member = await updateNewMember.execute({
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
        id_member: +id
      });

      if (member) member.cpf = +member.cpf.toString();

      return response.json({ member });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(401).json({ error: error.message });
      }
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const {id} = request.params;

      const memberRepository = new MemberRepository();

      const deleteMember = new DeleteMemberService(memberRepository);

      const member = await deleteMember.execute(+id);

      return response.status(201).json({});
    } catch (error) {
      if (error instanceof Error) {
        return response.status(401).json({error: error.message})
      }
    }
  }

}
