import prismaClient from "../../../shared/infra/database/prismaClient";
import AppError from "../../../shared/errors/AppError";
import NoExistError from "../../../shared/errors/NoExistError";
import type { ICreateCultOfferDTO } from "../dtos/ICreateCultOfferDTO";

export default class CreateCultOfferService {
  async execute({ id_cult, id_treasurer, value }: ICreateCultOfferDTO) {
    return prismaClient.$transaction(async (tx) => {
      const [cult, treasurer] = await Promise.all([
        tx.cult.findFirst({
          where: {
            id: id_cult,
            deletedAt: null,
          },
        }),
        tx.treasurer.findFirst({
          where: {
            id: id_treasurer,
            endDate: null,
          },
          include: {
            member: true,
          },
        }),
      ]);

      if (!cult) {
        throw new NoExistError("cult");
      }

      if (!treasurer) {
        throw new NoExistError("treasurer");
      }

      if (!treasurer.member || treasurer.member.id_church !== cult.id_church) {
        throw new AppError("Treasurer must belong to the same church as the cult", 400);
      }

      const offer = await tx.offer.create({
        data: {
          deletedAt: null,
          id_treasurer,
          value,
        },
      });

      const cultOffer = await tx.cultOffer.create({
        data: {
          id_cult,
          id_offer: offer.id,
        },
        include: {
          offer: true,
        },
      });

      return cultOffer;
    });
  }
}
