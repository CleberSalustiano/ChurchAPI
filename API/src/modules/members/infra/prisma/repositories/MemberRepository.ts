import { IMember } from "../../../../../entities/IMember";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateMemberDTO } from "../../../dtos/ICreateMemberDTO";
import { IUpdateOwnMemberProfileDTO } from "../../../dtos/IUpdateOwnMemberProfileDTO";
import { IUpdateMemberDTO } from "../../../dtos/IUpdateMemberDTO";
import { IMemberRepository } from "../../../repositories/IMemberRepository";

export default class MemberRepository implements IMemberRepository {
  public async create({
    batism_date,
    birth_date,
    cpf,
    email,
    id_church,
    name,
    rg,
    id_user,
    ecclesiasticalRole,
  }: ICreateMemberDTO): Promise<IMember | undefined> {
    const member = await prismaClient.member.create({
      data: {
        batism_date: new Date(batism_date.toString()),
        birth_date: new Date(birth_date.toString()),
        cpf,
        email,
        name,
        rg,
        ecclesiasticalRole,
        id_church,
        id_user,
      },
    });

    return member;
  }

  public async findAll(): Promise<IMember[] | undefined> {
    const members = await prismaClient.member.findMany({
      where: { deletedAt: null },
    });

    return members;
  }

  public async findByCPF(cpf: bigint): Promise<IMember | undefined> {
    const member = await prismaClient.member.findFirst({
      where: { cpf, deletedAt: null },
    });

    if (member) return member;

    return undefined;
  }

  public async findByEmail(email: string): Promise<IMember | undefined> {
    const member = await prismaClient.member.findFirst({
      where: {
        email,
        deletedAt: null,
        user: {
          deletedAt: null,
        },
      },
      include: { user: true },
    });

    if (member) return member;

    return undefined;
  }

  public async findById(id_member: number): Promise<IMember | undefined> {
    const member = await prismaClient.member.findFirst({
      where: { id: id_member, deletedAt: null },
    });

    if (member) return member;

    return undefined;
  }

  public async findByUserId(id_user: number): Promise<IMember | undefined> {
    const member = await prismaClient.member.findFirst({
      where: {
        id_user,
        deletedAt: null,
        user: {
          deletedAt: null,
        },
      },
      include: {
        church: {
          include: {
            location: true,
          },
        },
      },
    });

    if (member) return member;

    return undefined;
  }

  public async update({
    batism_date,
    birth_date,
    email,
    id_church,
    id_member,
    name,
    rg,
    ecclesiasticalRole,
    cpf,
  }: IUpdateMemberDTO): Promise<IMember | undefined> {
    const existingMember = await this.findById(id_member);

    if (!existingMember) return undefined;

    const member = await prismaClient.member.update({
      where: { id: id_member },
      data: {
        batism_date: new Date(batism_date.toString()),
        birth_date: new Date(birth_date.toString()),
        cpf,
        email,
        id_church,
        name,
        rg,
        ecclesiasticalRole,
      },
      include: { church: true },
    });

    return member;
  }

  public async updateOwnProfile({
    birth_date,
    email,
    id_member,
    name,
    rg,
  }: IUpdateOwnMemberProfileDTO): Promise<IMember | undefined> {
    const existingMember = await this.findById(id_member);

    if (!existingMember) return undefined;

    return prismaClient.member.update({
      where: { id: id_member },
      data: {
        birth_date: new Date(birth_date.toString()),
        email,
        name,
        rg,
      },
      include: { church: { include: { location: true } } },
    });
  }

  public async findAllbyChurch(
    id_church: number
  ): Promise<IMember[] | undefined> {
    const members = await prismaClient.member.findMany({
      where: { id_church: id_church, deletedAt: null },
    });

    return members;
  }

  public async delete(id_member: number): Promise<boolean> {
    const existingMember = await this.findById(id_member);

    if (!existingMember) return false;

    const member = await prismaClient.member.update({
      where: { id: id_member },
      data: { deletedAt: new Date() },
    });

    if (!member) return false;

    return true;
  }
}
