import { IChurch } from "../../../entities/IChurch";
import NoExistError from "../../../shared/errors/NoExistError";
import { IChurchRepository } from "../repositories/IChurchRepository";

export default class ReactivateChurchService {
  constructor(private churchRepository: IChurchRepository) {
    this.churchRepository = churchRepository;
  }

  public async execute(id_church: number): Promise<IChurch | undefined> {
    const church = await this.churchRepository.findById(id_church);

    if (!church) throw new NoExistError("church");

    if (church.type === "HEADQUARTER") {
      throw new Error("Headquarter can not be reactivated");
    }

    if (church.status === "DELETED") {
      throw new Error("Deleted church can not be reactivated");
    }

    if (church.status === "ACTIVE") {
      throw new Error("Church is already active");
    }

    return this.churchRepository.reactivate(id_church);
  }
}
