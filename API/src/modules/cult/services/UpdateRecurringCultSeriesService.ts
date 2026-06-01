import prismaClient from "../../../shared/infra/database/prismaClient";
import NoExistError from "../../../shared/errors/NoExistError";
import type { IUpdateRecurringCultSeriesDTO } from "../dtos/IUpdateRecurringCultSeriesDTO";

export default class UpdateRecurringCultSeriesService {
  async execute({ id_church, id_cult, theme }: IUpdateRecurringCultSeriesDTO) {
    return prismaClient.$transaction(async (tx) => {
      const cult = await tx.cult.findFirst({
        where: {
          id: id_cult,
          deletedAt: null,
        },
      });

      if (!cult) {
        throw new NoExistError("cult");
      }

      if (!cult.recurrenceGroup) {
        throw new NoExistError("recurring cult series");
      }

      const church = await tx.church.findFirst({
        where: {
          id: id_church,
          status: {
            not: "DELETED",
          },
        },
      });

      if (!church) {
        throw new NoExistError("church");
      }

      await tx.cult.updateMany({
        where: {
          deletedAt: null,
          recurrenceGroup: cult.recurrenceGroup,
          date: {
            gte: cult.date,
          },
        },
        data: {
          id_church,
          theme,
        },
      });

      const cults = await tx.cult.findMany({
        where: {
          deletedAt: null,
          recurrenceGroup: cult.recurrenceGroup,
        },
        include: {
          church: {
            include: {
              location: true,
            },
          },
          CultOffer: {
            where: {
              offer: {
                deletedAt: null,
              },
            },
            include: {
              offer: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      });

      return cults;
    });
  }
}
