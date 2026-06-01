import prismaClient from "../../../shared/infra/database/prismaClient";
import AppError from "../../../shared/errors/AppError";
import NoExistError from "../../../shared/errors/NoExistError";
import type { IUpdateCultOfferDTO } from "../dtos/IUpdateCultOfferDTO";

export default class UpdateCultOfferService {
  async execute({
    id_cult,
    id_cult_offer,
    id_treasurer,
    value,
  }: IUpdateCultOfferDTO) {
    return prismaClient.$transaction(async (tx) => {
      const [cult, cultOffer, treasurer] = await Promise.all([
        tx.cult.findFirst({
          where: {
            id: id_cult,
            deletedAt: null,
          },
        }),
        tx.cultOffer.findFirst({
          where: {
            id: id_cult_offer,
            id_cult,
          },
          include: {
            offer: true,
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

      if (!cultOffer || !cultOffer.offer || cultOffer.offer.deletedAt) {
        throw new NoExistError("cult offer");
      }

      if (!treasurer) {
        throw new NoExistError("treasurer");
      }

      if (!treasurer.member || treasurer.member.id_church !== cult.id_church) {
        throw new AppError("Treasurer must belong to the same church as the cult", 400);
      }

      await tx.offer.update({
        where: {
          id: cultOffer.id_offer,
        },
        data: {
          id_treasurer,
          value,
        },
      });

      return tx.cultOffer.findFirst({
        where: {
          id: id_cult_offer,
        },
        include: {
          offer: true,
        },
      });
    });
  }
}
