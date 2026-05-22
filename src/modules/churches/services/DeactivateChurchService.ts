import { IChurch } from "../../../entities/IChurch";
import NoExistError from "../../../shared/errors/NoExistError";
import { IChurchRepository } from "../repositories/IChurchRepository";

export default class DeactivateChurchService {
  constructor(private churchRepository: IChurchRepository) {
    this.churchRepository = churchRepository;
  }

  public async execute(id_church: number): Promise<IChurch | undefined> {
    const church = await this.churchRepository.findById(id_church);

    if (!church) throw new NoExistError("church");

    if (church.type === "HEADQUARTER") {
      throw new Error("Headquarter can not be deactivated");
    }

    if (church.status === "DELETED") {
      throw new Error("Deleted church can not be deactivated");
    }

    if (church.status === "INACTIVE") {
      throw new Error("Church is already inactive");
    }

    return this.churchRepository.deactivate(id_church);
  }
}
