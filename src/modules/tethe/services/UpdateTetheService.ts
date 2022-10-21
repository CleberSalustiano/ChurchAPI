import NoExistError from "../../../shared/errors/NoExistError";
import { IOfferRepository } from "../../../shared/modules/offer/repositories/IOfferRepository";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { ISpecialOfferRepository } from "../../specialOffer/repositories/ISpecialOfferRepository";
import UpdateSpecialOfferService from "../../specialOffer/services/UpdateSpecialOfferService";
import { ITreasurerRepository } from "../../treasurer/repositories/ITreasurerRepository";
import { IRequestUpdateTetheDTO } from "../dtos/IRequestUpdateTetheDTO";
import { ITetheRepository } from "../repositories/ITetheRepository";

export default class UpdateTetheService {
  constructor(
    private offerRepository: IOfferRepository,
    private specialOfferRepository: ISpecialOfferRepository,
    private tetheRepository: ITetheRepository,
    private treasurerRepository: ITreasurerRepository,
    private churchRepository: IChurchRepository,
    private memberRepository: IMemberRepository
  ) {
    this.offerRepository = offerRepository;
    this.specialOfferRepository = specialOfferRepository;
    this.churchRepository = churchRepository;
    this.memberRepository = memberRepository;
    this.treasurerRepository = treasurerRepository;
    this.tetheRepository = tetheRepository;
  }

  async execute({
    date,
    id_church,
    id_member,
    id_tethe,
    id_treasurer,
    month,
    reason,
    value,
    year,
  }: IRequestUpdateTetheDTO) {
    const tethe = await this.tetheRepository.findById(id_tethe);

    const updateSpecialOffer = new UpdateSpecialOfferService(
      this.offerRepository,
      this.specialOfferRepository,
      this.treasurerRepository,
      this.churchRepository,
      this.memberRepository
    );

    if (!tethe) throw new NoExistError("Tethe");

    const specialOfferUpdated = await updateSpecialOffer.execute({
      id_special_offer: tethe.id_special_offer,
      date,
      id_church,
      id_member,
      id_treasurer,
      reason,
      value,
    });

    if (!specialOfferUpdated) throw new Error("Tethe doesn't updated");

    const tetheUpdated = await this.tetheRepository.update({
      id_tethe,
      month,
      year,
    });

    if (!tetheUpdated) throw new Error("Tethe doesn't updated");

    return tetheUpdated;
  }
}
