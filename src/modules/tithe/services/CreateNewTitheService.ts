import { IOfferRepository } from "../../../shared/modules/offer/repositories/IOfferRepository";
import { IChurchRepository } from "../../churches/repositories/IChurchRepository";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { ISpecialOfferRepository } from "../../specialOffer/repositories/ISpecialOfferRepository";
import CreateNewSpecialOfferService from "../../specialOffer/services/CreateNewSpecialOfferService";
import { ITreasurerRepository } from "../../treasurer/repositories/ITreasurerRepository";
import { IRequestCreateTitheDTO } from "../dtos/IRequestCreateTitheDTO";
import { ITitheRepository } from "../repositories/ITitheRepository";

export default class CreateNewTitheService {
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
    month,
    reason,
    year,
    id_treasurer,
    value,
  }: IRequestCreateTitheDTO) {
    const createSpecialOffer = new CreateNewSpecialOfferService(
      this.offerRepository,
      this.specialOfferRepository,
      this.treasurerRepository,
      this.churchRepository,
      this.memberRepository
    );

    const specialOffer = await createSpecialOffer.execute({
      date,
      id_church,
      id_member,
      id_treasurer,
      reason,
      value,
    });

    if (!specialOffer) throw new Error("The tithe was not created");

    const tithe = await this.titheRepository.create({
      id_special_offer: specialOffer.id,
      month,
      year,
    });

    if (!tithe) throw new Error("The tithe was not created");

    return tithe;
  }
}
