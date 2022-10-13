import NoExistError from "../../../shared/errors/NoExistError";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { IUpdateTreasurerDTO } from "../dtos/IUpdateTreasurerDTO";
import { ITreasurerRepository } from "../repositories/ITreasurerRepository";

export default class UpdateTreasurerService {
  constructor(
    private memberRepository: IMemberRepository,
    private treasurerRepository: ITreasurerRepository
  ) {
    this.memberRepository = memberRepository;
    this.treasurerRepository = treasurerRepository;
  }

  async execute(dataTreasurer: IUpdateTreasurerDTO) {
    const treasurer = await this.treasurerRepository.findById(
      dataTreasurer.id_treasurer
    );

    if (!treasurer) {
      throw new NoExistError("treasurer");
    }

    const member = await this.memberRepository.findById(
      dataTreasurer.id_member
    );

    if (!member) {
      throw new NoExistError("member");
    }

    const updatedTreasurer = await this.treasurerRepository.update(
      dataTreasurer
    );

    return updatedTreasurer;
  }
}
