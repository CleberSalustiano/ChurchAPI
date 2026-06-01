import prismaClient from "../../../shared/infra/database/prismaClient";
import NoExistError from "../../../shared/errors/NoExistError";

export default class DeleteCultOfferService {
  async execute(id_cult: number, id_cult_offer: number) {
    return prismaClient.$transaction(async (tx) => {
      const cultOffer = await tx.cultOffer.findFirst({
        where: {
          id: id_cult_offer,
          id_cult,
        },
        include: {
          offer: true,
        },
      });

      if (!cultOffer || !cultOffer.offer) {
        throw new NoExistError("cult offer");
      }

      await tx.offer.update({
        where: {
          id: cultOffer.id_offer,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      return {
        id: cultOffer.id,
        id_cult: cultOffer.id_cult,
        id_offer: cultOffer.id_offer,
      };
    });
  }
}
