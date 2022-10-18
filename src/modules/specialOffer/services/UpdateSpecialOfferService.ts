import DateError from "../../../shared/errors/DateError";
import NoExistError from "../../../shared/errors/NoExistError";
import { IOfferRepository } from "../../../shared/modules/offer/repositories/IOfferRepository";
import { confirmIsDate } from "../../../shared/utils/confirmIsDate";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { ITreasurerRepository } from "../../treasurer/repositories/ITreasurerRepository";
import { IRequestUpdateSpecialOfferDTO } from "../dtos/IRequestUpdateSpecialOfferDTO";
import { ISpecialOfferRepository } from "../repositories/ISpecialOfferRepository";

export default class UpdateSpecialOfferService {
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
    id_special_offer,
    id_treasurer,
    reason,
    value,
  }: IRequestUpdateSpecialOfferDTO) {
    const specialOffer = await this.specialOfferRepository.findById(
      id_special_offer
    );

    if (!specialOffer) throw new NoExistError("Special Offer");

    if (!confirmIsDate(date)) throw new DateError();

    const church = await this.churchRepository.findById(id_church);

    if (!church) throw new NoExistError("Church");

    const member = await this.memberRepository.findById(id_member);

    if (!member) throw new NoExistError("Member");

    const treasurer = await this.treasurerRepository.findById(id_treasurer);

    if (!treasurer) throw new NoExistError("Treasuerer");

    const offer = await this.offerRepository.findById(specialOffer.id_offer);

    if (
      offer &&
      (offer?.value != value || offer.id_treasurer != id_treasurer)
    ) {
      await this.offerRepository.update({
        id_offer: offer.id,
        id_treasurer,
        value,
      });
    }

    const newSpecialOffer = await this.specialOfferRepository.update({
      date,
      id_church,
      id_member,
      id_special_offer,
      reason,
    });

    if (!newSpecialOffer) throw new Error("This special offer wasn't updated");

    return newSpecialOffer;
  }
}
