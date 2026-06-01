import { randomUUID } from "crypto";
import prismaClient from "../../../shared/infra/database/prismaClient";
import AppError from "../../../shared/errors/AppError";
import DateError from "../../../shared/errors/DateError";
import NoExistError from "../../../shared/errors/NoExistError";
import { confirmIsDate } from "../../../shared/utils/confirmIsDate";
import type { ICreateRecurringCultSeriesDTO } from "../dtos/ICreateRecurringCultSeriesDTO";

function addWeeks(date: Date, weeks: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + weeks * 7);
  return nextDate;
}

export default class CreateRecurringCultSeriesService {
  async execute({
    date,
    id_church,
    recurrence,
    theme,
  }: ICreateRecurringCultSeriesDTO) {
    if (!confirmIsDate(date) || !confirmIsDate(recurrence.until)) {
      throw new DateError();
    }

    if (!Number.isInteger(recurrence.interval) || recurrence.interval < 1) {
      throw new AppError("Recurrence interval must be a positive integer", 400);
    }

    return prismaClient.$transaction(async (tx) => {
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

      const startDate = new Date(date.toString());
      const untilDate = new Date(recurrence.until.toString());

      if (untilDate.getTime() < startDate.getTime()) {
        throw new AppError("Recurrence end date must be after the start date", 400);
      }

      const recurrenceGroup = randomUUID();
      const recurrencePattern = `WEEKLY:${recurrence.interval}`;
      const cultDates: Date[] = [];

      let currentDate = startDate;

      while (currentDate.getTime() <= untilDate.getTime()) {
        cultDates.push(currentDate);

        if (cultDates.length > 104) {
          throw new AppError(
            "Recurrence is too long for a single request. Reduce the date range.",
            400
          );
        }

        currentDate = addWeeks(currentDate, recurrence.interval);
      }

      const createdCults = [];

      for (const cultDate of cultDates) {
        const cult = await tx.cult.create({
          data: {
            date: cultDate,
            theme,
            id_church,
            recurrenceGroup,
            recurrencePattern,
            recurrenceUntil: untilDate,
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
        });

        createdCults.push(cult);
      }

      return createdCults;
    });
  }
}
