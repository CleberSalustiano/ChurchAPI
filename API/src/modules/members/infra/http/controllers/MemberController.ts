import { Request, Response } from "express";
import membersJsonCorrection from "../../../../../shared/utils/membersJsonCorrection";
import {
  makeCreateMemberService,
  makeDeleteMemberService,
  makeUpdateOwnMemberProfileService,
  makeUpdateMemberService,
  memberRepository,
} from "../../../../../shared/container";

type ScopedRequest = Request & {
  user?: {
    access?: {
      scope: "GLOBAL" | "CHURCH";
      churchId: number;
    };
  };
};

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
  email: string;
  id_member: number;
}

interface IRequestOwnProfileUpdate {
  name: string;
  email: string;
  birth_date: string;
  rg: number;
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

    const member = await createNewMember.execute({
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

    const memberResponse = member
      ? {
          ...member,
          cpf: member.cpf.toString(),
        }
      : undefined;

    return response.json({ member: memberResponse });
  }

  async index(request: ScopedRequest, response: Response) {
    const access = request.user?.access;
    const membersNoJson =
      access?.scope === "CHURCH"
        ? await memberRepository.findAllbyChurch(access.churchId)
        : await memberRepository.findAll();

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
      rg,
      ecclesiasticalRole,
      id_church,
    }: IRequestUpdate = request.body;

    const { id } = request.params;

    const updateNewMember = makeUpdateMemberService();

    const member = await updateNewMember.execute({
      batism_date,
      birth_date,
      cpf,
      email,
      name,
      rg,
      ecclesiasticalRole,
      id_church,
      id_member: +id,
    });

    const memberResponse = member
      ? {
          ...member,
          cpf: member.cpf.toString(),
        }
      : undefined;

    return response.json({ member: memberResponse });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const deleteMember = makeDeleteMemberService();

    await deleteMember.execute(+id);

    return response.status(204).send();
  }

  async updateOwnProfile(request: Request, response: Response) {
    const { birth_date, email, name, rg }: IRequestOwnProfileUpdate = request.body;
    const { id } = request.params;

    const updateOwnMemberProfile = makeUpdateOwnMemberProfileService();
    const member = await updateOwnMemberProfile.execute({
      birth_date,
      email,
      id_member: +id,
      name,
      rg,
    });

    const memberResponse = member
      ? {
          ...member,
          cpf: member.cpf.toString(),
        }
      : undefined;

    return response.json({ member: memberResponse });
  }
}
