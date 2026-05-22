import NoExistError from "../../../shared/errors/NoExistError";
import { IOfferRepository } from "../../../shared/modules/offer/repositories/IOfferRepository";
import { IChurchRepository } from "../../churches/repositories/IChurchRepository";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { ISpecialOfferRepository } from "../../specialOffer/repositories/ISpecialOfferRepository";
import UpdateSpecialOfferService from "../../specialOffer/services/UpdateSpecialOfferService";
import { ITreasurerRepository } from "../../treasurer/repositories/ITreasurerRepository";
import { IRequestUpdateTitheDTO } from "../dtos/IRequestUpdateTitheDTO";
import { ITitheRepository } from "../repositories/ITitheRepository";

export default class UpdateTitheService {
  constructor(
    private offerRepository: IOfferRepository,
    private specialOfferRepository: ISpecialOfferRepository,
    private titheRepository: ITitheRepository,
    private treasurerRepository: ITreasurerRepository,
    private churchRepository: IChurchRepository,
    private memberRepository: IMemberRepository
  ) {
    this.offerRepository = offerRepository;
    this.specialOfferRepository = specialOfferRepository;
    this.churchRepository = churchRepository;
    this.memberRepository = memberRepository;
    this.treasurerRepository = treasurerRepository;
    this.titheRepository = titheRepository;
  }

  async execute({
    date,
    id_church,
    id_member,
    id_tithe,
    id_treasurer,
    month,
    reason,
    value,
    year,
  }: IRequestUpdateTitheDTO) {
    const tithe = await this.titheRepository.findById(id_tithe);

    const updateSpecialOffer = new UpdateSpecialOfferService(
      this.offerRepository,
      this.specialOfferRepository,
      this.treasurerRepository,
      this.churchRepository,
      this.memberRepository
    );

    if (!tithe) throw new NoExistError("Tithe");

    const specialOfferUpdated = await updateSpecialOffer.execute({
      id_special_offer: tithe.id_special_offer,
      date,
      id_church,
      id_member,
      id_treasurer,
      reason,
      value,
    });

    if (!specialOfferUpdated) throw new Error("Tithe was not updated");

    const titheUpdated = await this.titheRepository.update({
      id_tithe,
      month,
      year,
    });

    if (!titheUpdated) throw new Error("Tithe was not updated");

    return titheUpdated;
  }
}
