import { Request, Response } from "express";
import membersJsonCorrection from "../../../../../shared/utils/membersJsonCorrection";
import ChurchRepository from "../../../../churchs/infra/prisma/repositories/ChurchRepository";
import CreateNewMemberService from "../../../services/CreateNewMemberService";
import UpdateNewMemberService from "../../../services/UpdateMemberService";
import MemberRepository from "../../prisma/repositories/MemberRepository";
import DeleteMemberService from "../../../services/DeleteMemberService";
import { UserRepository } from "../../prisma/repositories/UserRepository";

interface IRequestCreate {
  id_church: number;
  name: string;
  birth_date: string;
  batism_date: string;
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
  birth_date: string;
  batism_date: string;
  titleChurch: string;
  cpf: bigint;
  rg: number;
  login: string;
  email: string;
  password: string;
  id_member: number;
}

const memberRepository = new MemberRepository();
const churchRepository = new ChurchRepository();
const userRepository = new UserRepository();

export default class MemberController {
  async create(request: Request, response: Response) {
    try {
      const {
        batism_date,
        birth_date,
        cpf,
        email,
        name,
        password,
        login, 
        rg,
        titleChurch,
        id_church,
      }: IRequestCreate = request.body;

      const createNewMember = new CreateNewMemberService(
        memberRepository,
        userRepository,
        churchRepository
      );

      let member = await createNewMember.execute({
        batism_date,
        birth_date,
        cpf,
        email,
        name,
        password,
        rg,
        login,
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
    try {
      const membersNoJson = await memberRepository.findAll();

    const members = membersJsonCorrection(membersNoJson);

    return response.json({ members });
    } catch (err) {
      if (err instanceof Error) 
        return response.status(401).json({error: err.message})
    }
  }

  async update(request: Request, response: Response) {
    try {
      const {
        batism_date,
        birth_date,
        cpf,
        email,
        name,
        password,
        rg,
        login,
        titleChurch,
        id_church,
      }: IRequestUpdate = request.body;

      const { id } = request.params;

      const updateNewMember = new UpdateNewMemberService(
        memberRepository,
        userRepository,
        churchRepository
      );

      let member = await updateNewMember.execute({
        batism_date,
        birth_date,
        cpf,
        email,
        name,
        password,
        rg,
        login,
        titleChurch,
        id_church,
        id_member: +id,
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
      const { id } = request.params;

      const deleteMember = new DeleteMemberService(memberRepository, userRepository);

      await deleteMember.execute(+id);

      return response.status(201).json({});
    } catch (error) {
      if (error instanceof Error) {
        return response.status(401).json({ error: error.message });
      }
    }
  }
}
