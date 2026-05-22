import { IChurch } from "../../../entities/IChurch";
import NoExistError from "../../../shared/errors/NoExistError";
import { IChurchRepository } from "../repositories/IChurchRepository";

export default class DeleteChurchService {
  constructor(private churchRepository: IChurchRepository) {
    this.churchRepository = churchRepository;
  }

  public async execute(id_church: number) : Promise<IChurch | undefined>{
    const church = await this.churchRepository.findById(id_church);

    if (!church)
      throw new NoExistError("church")

    if (church.type === "HEADQUARTER")
      throw new Error("Headquarter can not be deleted")
    
    const isChurchDeleted = await this.churchRepository.delete(id_church);

    if (!isChurchDeleted)
      throw new Error("Church doesn't deleted")

    return church;
  }

}
