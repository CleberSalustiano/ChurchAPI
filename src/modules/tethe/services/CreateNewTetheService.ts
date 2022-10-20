import { IOfferRepository } from "../../../shared/modules/offer/repositories/IOfferRepository";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { ISpecialOfferRepository } from "../../specialOffer/repositories/ISpecialOfferRepository";
import CreateNewSpecialOfferService from "../../specialOffer/services/CreateNewSpecialOfferService";
import { ITreasurerRepository } from "../../treasurer/repositories/ITreasurerRepository";
import { ICreateTetheDTO } from "../dtos/ICreateTetheDTO";
import { IRequestCreateTetheDTO } from "../dtos/IRequestCreateTetheDTO";
import { ITetheRepository } from "../repositories/ITetheRepository";

export default class CreateNewTetheService {
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
    month,
    reason,
    year,
    id_treasurer,
    value,
  }: IRequestCreateTetheDTO) {
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

    if (!specialOffer) throw new Error("The tethe doesn't created");

    const tethe = await this.tetheRepository.create({
      id_special_offer: specialOffer.id,
      month,
      year,
    });

    if (!tethe) throw new Error("The tethe doesn't created");

    return tethe;
  }
}
