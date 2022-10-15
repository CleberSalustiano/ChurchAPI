import NoExistError from "../../../shared/errors/NoExistError";
import { IOfferRepository } from "../../../shared/modules/offer/repositories/IOfferRepository";
import CreateNewOfferService from "../../../shared/modules/offer/services/CreateNewOfferService";
import { confirmIsDate } from "../../../shared/utils/confirmIsDate";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { ITreasurerRepository } from "../../treasurer/repositories/ITreasurerRepository";
import { IRequestCreateSpecialOfferDTO } from "../dtos/IRequestCreateSpecialOfferDTO";
import { ISpecialOfferRepository } from "../repositories/ISpecialOfferRepository";

export default class CreateNewSpecialOfferService {
  constructor(
    private offerRepository: IOfferRepository,
    private specialOfferRepository: ISpecialOfferRepository,
    private treasurerRepository: ITreasurerRepository,
    private churchRepository: IChurchRepository,
    private memberRepository: IMemberRepository
  ) {
    this.offerRepository = offerRepository;
    this.specialOfferRepository = specialOfferRepository;
    this.churchRepository = churchRepository;
    this.memberRepository = memberRepository;
    this.treasurerRepository = treasurerRepository;
  }

  async execute({
    date,
    id_church,
    id_member,
    id_treasurer,
    reason,
    value,
  }: IRequestCreateSpecialOfferDTO) {
    const createOffer = new CreateNewOfferService(
      this.offerRepository,
      this.treasurerRepository
    );
    const member = await this.memberRepository.findById(id_member);

    if (!member) throw new NoExistError("member");

    const church = await this.churchRepository.findById(id_church);

    if (!church) throw new NoExistError("church");

    if (!confirmIsDate(date))
      throw new Error("Date format is incorrect (yyyy-mm-dd)");

    const offer = await createOffer.execute({ id_treasurer, value });

    if (!offer) throw new Error("This offer wasn't created");

    const specialOffer = await this.specialOfferRepository.create({
      date,
      id_church,
      id_member,
      id_offer: offer.id,
      reason,
    });

    if (!specialOffer) throw new Error("This specialOffer wasn't created");

    return specialOffer;
  }
}
