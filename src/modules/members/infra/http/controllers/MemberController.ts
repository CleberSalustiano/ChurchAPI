import { Request, Response } from "express";
import membersJsonCorrection from "../../../../../shared/utils/membersJsonCorrection";
import {
  makeCreateMemberService,
  makeDeleteMemberService,
  makeUpdateMemberService,
  memberRepository,
} from "../../../../../shared/container";

interface IRequestCreate {
  id_church: number;
  name: string;
  birth_date: string;
  batism_date: string;
  ecclesiasticalRole: string;
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
  ecclesiasticalRole: string;
  cpf: bigint;
  rg: number;
  login: string;
  email: string;
  password: string;
  id_member: number;
}

export default class MemberController {
  async create(request: Request, response: Response) {
    const {
      batism_date,
      birth_date,
      cpf,
      email,
      name,
      password,
      login, 
      rg,
      ecclesiasticalRole,
      id_church,
    }: IRequestCreate = request.body;

    const createNewMember = makeCreateMemberService();

    let member = await createNewMember.execute({
      batism_date,
      birth_date,
      cpf,
      email,
      name,
      password,
      rg,
      login,
      ecclesiasticalRole,
      id_church,
    });

    if (member) member.cpf = +member.cpf.toString();

    return response.json({ member });
  }

  async index(request: Request, response: Response) {
    const membersNoJson = await memberRepository.findAll();

    const members = membersJsonCorrection(membersNoJson);

    return response.json({ members });
  }

  async update(request: Request, response: Response) {
    const {
      batism_date,
      birth_date,
      cpf,
      email,
      name,
      password,
      rg,
      login,
      ecclesiasticalRole,
      id_church,
    }: IRequestUpdate = request.body;

    const { id } = request.params;

    const updateNewMember = makeUpdateMemberService();

    let member = await updateNewMember.execute({
      batism_date,
      birth_date,
      cpf,
      email,
      name,
      password,
      rg,
      login,
      ecclesiasticalRole,
      id_church,
      id_member: +id,
    });

    if (member) member.cpf = +member.cpf.toString();

    return response.json({ member });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const deleteMember = makeDeleteMemberService();

    await deleteMember.execute(+id);

    return response.status(204).send();
  }
}
