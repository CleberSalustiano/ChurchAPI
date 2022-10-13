import NoExistError from "../../../shared/errors/NoExistError";
import TreasurerRepository from "../infra/prisma/repositories/TreasureRepository";
import { ITreasurerRepository } from "../repositories/ITreasurerRepository";

export default class DeleteTreasurerService {
  constructor(private treasurerRepository: ITreasurerRepository) {
    this.treasurerRepository = treasurerRepository;
  }

  async execute(id_treasurer: number) {
    const treasurer = await this.treasurerRepository.findById(id_treasurer);

    if (!treasurer) throw new NoExistError("treasurer");

    const treasurerDeleted = await this.treasurerRepository.endTreasurer(
      id_treasurer
    );

    if (treasurerDeleted?.endDate === undefined)
      throw new Error("This manager doesn't deleted");

    return treasurerDeleted;
  }
}
