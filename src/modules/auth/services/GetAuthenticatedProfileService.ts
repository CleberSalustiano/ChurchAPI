import NoExistError from "../../../shared/errors/NoExistError";
import memberPublicData from "../../../shared/utils/memberPublicData";
import userPublicData from "../../../shared/utils/userPublicData";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { IUserRepository } from "../../members/repositories/IUserRepository";

export default class GetAuthenticatedProfileService {
  constructor(
    private userRepository: IUserRepository,
    private memberRepository: IMemberRepository
  ) {
    this.userRepository = userRepository;
    this.memberRepository = memberRepository;
  }

  async execute(id_user: number) {
    const user = await this.userRepository.findById(id_user);

    if (!user) throw new NoExistError("user");

    const member = await this.memberRepository.findByUserId(id_user);

    if (!member) throw new NoExistError("member");

    return {
      user: userPublicData(user),
      member: memberPublicData(member),
    };
  }
}
