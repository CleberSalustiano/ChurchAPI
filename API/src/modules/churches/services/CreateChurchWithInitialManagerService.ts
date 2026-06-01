import prismaClient from "../../../shared/infra/database/prismaClient";
import AlreadyExistError from "../../../shared/errors/AlreadyExistError";
import AppError from "../../../shared/errors/AppError";
import DateError from "../../../shared/errors/DateError";
import { hashPassword, resolveInitialMemberPassword } from "../../../shared/security/password";
import { confirmIsDate } from "../../../shared/utils/confirmIsDate";
import { normalizeCpfDigits, normalizeCpfToBigInt } from "../../../shared/utils/normalizeCpf";
import type { ICreateChurchWithManagerDTO } from "../dtos/ICreateChurchWithManagerDTO";

class CreateChurchWithInitialManagerService {
  public async execute({ church, manager }: ICreateChurchWithManagerDTO) {
    if (!confirmIsDate(church.date)) {
      throw new DateError();
    }

    if (!confirmIsDate(manager.birth_date) || !confirmIsDate(manager.batism_date)) {
      throw new DateError();
    }

    if (manager.birth_date.toString() === manager.batism_date.toString()) {
      throw new AppError("Birth date and Batism date can not be equals", 400);
    }

    const normalizedCpfDigits = normalizeCpfDigits(manager.cpf);

    if (normalizedCpfDigits.length !== 11) {
      throw new AppError("CPF format is incorrect", 400);
    }

    const normalizedCpf = normalizeCpfToBigInt(manager.cpf);
    const initialPassword = resolveInitialMemberPassword(
      normalizedCpfDigits,
      manager.password
    );
    const hashedPassword = await hashPassword(initialPassword, {
      skipPolicy: true,
    });

    return prismaClient.$transaction(async (tx) => {
      const [existingMemberCpf, existingUser, headquarter] = await Promise.all([
        tx.member.findFirst({
          where: {
            cpf: normalizedCpf,
            deletedAt: null,
          },
        }),
        tx.user.findFirst({
          where: {
            login: manager.login,
            deletedAt: null,
          },
        }),
        tx.church.findFirst({
          where: {
            type: "HEADQUARTER",
            status: {
              not: "DELETED",
            },
          },
          include: { location: true },
        }),
      ]);

      if (existingMemberCpf) {
        throw new AlreadyExistError("member with this CPF");
      }

      if (existingUser) {
        throw new AppError("Already exist this user!", 400);
      }

      let location = await tx.location.findFirst({
        where: { cep: church.cep },
      });

      if (!location) {
        location = await tx.location.create({
          data: {
            cep: church.cep,
            city: church.city,
            country: church.country,
            district: church.district,
            state: church.state,
            street: church.street,
          },
        });
      }

      const existingChurchAtLocation = await tx.church.findFirst({
        where: {
          id_location: location.id,
          status: {
            not: "DELETED",
          },
        },
      });

      if (existingChurchAtLocation) {
        throw new AlreadyExistError("church");
      }

      const requestedType = church.type;
      let finalType: "HEADQUARTER" | "BRANCH";
      let parentChurchId: number | null;

      if (!headquarter) {
        if (requestedType === "BRANCH") {
          throw new AppError("Can not create a branch before the headquarter", 400);
        }

        finalType = "HEADQUARTER";
        parentChurchId = null;
      } else {
        if (requestedType === "HEADQUARTER") {
          throw new AppError("This system already has a headquarter", 400);
        }

        finalType = "BRANCH";
        parentChurchId = headquarter.id;
      }

      const createdChurch = await tx.church.create({
        data: {
          creationDate: new Date(church.date.toString()),
          id_location: location.id,
          parentChurchId,
          type: finalType,
        },
        include: { location: true },
      });

      const user = await tx.user.create({
        data: {
          login: manager.login,
          password: hashedPassword,
        },
      });

      const memberRecord = await tx.member.create({
        data: {
          batism_date: new Date(manager.batism_date.toString()),
          birth_date: new Date(manager.birth_date.toString()),
          cpf: normalizedCpf,
          ecclesiasticalRole: manager.ecclesiasticalRole,
          email: manager.email,
          id_church: createdChurch.id,
          id_user: user.id,
          name: manager.name,
          rg: manager.rg,
        },
      });

      const managerRecord = await tx.manager.create({
        data: {
          id_church: createdChurch.id,
          id_member: memberRecord.id,
        },
      });

      return {
        church: createdChurch,
        manager: managerRecord,
        member: {
          ...memberRecord,
          cpf: memberRecord.cpf.toString(),
        },
        user: {
          id: user.id,
          login: user.login,
        },
      };
    });
  }
}

export default CreateChurchWithInitialManagerService;
