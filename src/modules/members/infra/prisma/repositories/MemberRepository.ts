import { IMember } from "../../../../../entities/IMember";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateMemberDTO } from "../../../dtos/ICreateMemberDTO";
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
    titleChurch,
  }: ICreateMemberDTO): Promise<IMember | undefined> {
    const member = await prismaClient.member.create({
      data: {
        batism_date: new Date(batism_date.toString()),
        birth_date: new Date(birth_date.toString()),
        cpf,
        email,
        name,
        rg,
        titleChurch,
        id_church,
        id_user,
      },
    });

    return member;
  }

  public async findAll(): Promise<IMember[] | undefined> {
    const members = await prismaClient.member.findMany();

    return members;
  }

  public async findByCPF(cpf: bigint): Promise<IMember | undefined> {
    const member = await prismaClient.member.findFirst({ where: { cpf } });

    if (member) return member;

    return undefined;
  }

  public async findById(id_member: number): Promise<IMember | undefined> {
    const member = await prismaClient.member.findFirst({
      where: { id: id_member },
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
    titleChurch,
    cpf,
  }: IUpdateMemberDTO): Promise<IMember | undefined> {
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
        titleChurch,
      },
      include: { church: true },
    });

    return member;
  }

  public async findAllbyChurch(
    id_church: number
  ): Promise<IMember[] | undefined> {
    const members = await prismaClient.member.findMany({
      where: { id_church: id_church },
    });

    return members;
  }

  public async delete(id_member: number): Promise<boolean> {
    const member = await prismaClient.member.delete({
      where: { id: id_member },
    });

    if (!member) return false;

    return true;
  }
}
