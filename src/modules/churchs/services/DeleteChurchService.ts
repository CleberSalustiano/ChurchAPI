import { IChurch } from "../../../entities/IChurch";
import NoExistError from "../../../shared/errors/NoExistError";
import { IChurchRepository } from "../repositories/IChurchRepository";
import { ILocationRepository } from "../repositories/ILocationRepository";

export default class DeleteChurchService {
  constructor(
    private churchRepository: IChurchRepository,
    private locationRepository: ILocationRepository
  ) {
    this.churchRepository = churchRepository;
    this.locationRepository = locationRepository;
  }

  public async execute(id_church: number) : Promise<IChurch | undefined>{
    const church = await this.churchRepository.findById(id_church);

    if (!church)
      throw new NoExistError("church")
    
    const isChurchDeleted = await this.churchRepository.delete(id_church);

    if (!isChurchDeleted)
      throw new Error("Church doesn't deleted")

    const isLocationDeleted = await this.locationRepository.delete(church.id_location);

    if (!isLocationDeleted)
      throw new Error("Location doesn't deleted")

    return church;
  }

}