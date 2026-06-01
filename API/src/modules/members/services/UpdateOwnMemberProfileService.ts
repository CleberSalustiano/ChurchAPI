import DateError from "../../../shared/errors/DateError";
import NoExistError from "../../../shared/errors/NoExistError";
import { confirmIsDate } from "../../../shared/utils/confirmIsDate";
import { IMemberRepository } from "../repositories/IMemberRepository";
import type { IUpdateOwnMemberProfileDTO } from "../dtos/IUpdateOwnMemberProfileDTO";

export default class UpdateOwnMemberProfileService {
  constructor(private memberRepository: IMemberRepository) {
    this.memberRepository = memberRepository;
  }

  async execute(data: IUpdateOwnMemberProfileDTO) {
    const member = await this.memberRepository.findById(data.id_member);

    if (!member) {
      throw new NoExistError("member");
    }

    if (!confirmIsDate(data.birth_date)) {
      throw new DateError();
    }

    const updatedMember = await this.memberRepository.updateOwnProfile(data);

    if (!updatedMember) {
      throw new Error("This member profile wasn't updated");
    }

    return updatedMember;
  }
}
