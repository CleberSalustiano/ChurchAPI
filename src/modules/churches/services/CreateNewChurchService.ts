import { IChurch } from "../../../entities/IChurch";
import AlreadyExistError from "../../../shared/errors/AlreadyExistError";
import { confirmIsDate } from "../../../shared/utils/confirmIsDate";
import { ICreateChurchDTO } from "../dtos/ICreateChurchDTO";
import { ICreateLocationDTO } from "../dtos/ICreateLocationDTO";
import { IChurchRepository } from "../repositories/IChurchRepository";
import { ILocationRepository } from "../repositories/ILocationRepository";

class CreateNewChurchService {

  constructor(
    private churchRepository: IChurchRepository,
    private locationRepository: ILocationRepository
  ) {
    this.churchRepository = churchRepository;
    this.locationRepository = locationRepository;
  }

  public async execute(dataChurch: ICreateChurchDTO, dataLocation: ICreateLocationDTO): Promise<IChurch | undefined> {
    if (!confirmIsDate(dataChurch.date)) 
      throw new Error("Date format is incorrect (yyyy-mm-dd)")
    
    let location = await this.locationRepository.findByCep(dataLocation.cep);

    if (!location) {
      location = await this.locationRepository.create(dataLocation);
    }

    if (location) {
      dataChurch.id_location = location.id;
    } else {
      throw new Error("Create Location Problem")
    }

    const existChurch = await this.churchRepository.findByLocation(dataChurch.id_location)
    
    if (existChurch) {
      throw new AlreadyExistError("church");
    }

    const headquarter = await this.churchRepository.findHeadquarter();
    const requestedType = dataChurch.type;

    if (!headquarter) {
      if (requestedType === "BRANCH") {
        throw new Error("Can not create a branch before the headquarter");
      }

      dataChurch.type = "HEADQUARTER";
      dataChurch.parent_church_id = null;
    } else {
      if (requestedType === "HEADQUARTER") {
        throw new Error("This system already has a headquarter");
      }

      dataChurch.type = "BRANCH";
      dataChurch.parent_church_id = headquarter.id;
    }

    const church = await this.churchRepository.create(dataChurch);

    return church;
  }

}

export default CreateNewChurchService;
