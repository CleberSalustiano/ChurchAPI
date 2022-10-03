import NoExistError from "../../../shared/errors/NoExistError";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { ITreasurerRepository } from "../repositories/ITreasurerRepository";

export default class CreateNewTreasurerService {
  constructor(
    private memberRepository: IMemberRepository,
    private treasurerRepository: ITreasurerRepository
  ) {
    this.memberRepository = memberRepository;
    this.treasurerRepository = treasurerRepository;
  }

  async execute(id_member: number) {
    const member = await this.memberRepository.findById(id_member);

    if (!member)
      throw new NoExistError("member");

    const treasurer = await this.treasurerRepository.create(id_member);

    return treasurer
  }
}
