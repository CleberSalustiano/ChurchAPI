import prismaClient from "../../../shared/infra/database/prismaClient";
import AlreadyExistError from "../../../shared/errors/AlreadyExistError";
import AppError from "../../../shared/errors/AppError";
import NoExistError from "../../../shared/errors/NoExistError";
import type { IReplaceManagerDTO } from "../dtos/IReplaceManagerDTO";

export default class ReplaceManagerService {
  async execute({ id_manager, id_member }: IReplaceManagerDTO) {
    return prismaClient.$transaction(async (tx) => {
      const currentManager = await tx.manager.findFirst({
        where: {
          id: id_manager,
          endDate: null,
        },
      });

      if (!currentManager) {
        throw new NoExistError("manager");
      }

      const replacementMember = await tx.member.findFirst({
        where: {
          id: id_member,
          deletedAt: null,
        },
      });

      if (!replacementMember) {
        throw new NoExistError("member");
      }

      if (replacementMember.id_church !== currentManager.id_church) {
        throw new AppError(
          "Member must belong to the same church as the manager assignment",
          400
        );
      }

      if (replacementMember.id === currentManager.id_member) {
        throw new AppError("Replacement member must be different from the current manager", 400);
      }

      const activeManagerForMember = await tx.manager.findFirst({
        where: {
          id_member,
          endDate: null,
        },
      });

      if (activeManagerForMember) {
        throw new AlreadyExistError("member with manager title");
      }

      const previousManager = await tx.manager.update({
        where: { id: id_manager },
        data: { endDate: new Date() },
      });

      const manager = await tx.manager.create({
        data: {
          id_church: currentManager.id_church,
          id_member,
        },
      });

      return {
        previousManager,
        manager,
      };
    });
  }
}
