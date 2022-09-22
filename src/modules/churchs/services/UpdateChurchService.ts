import { Church } from "@prisma/client";
import { confirmIsDate } from "../../../shared/utils/confirmIsDate";
import { IUpdateChurchDTO } from "../dtos/IUpdateChurchDTO";
import { IUpdateLocationDTO } from "../dtos/IUpdateLocationDTO";
import { IChurchRepository } from "../repositories/IChurchRepository";
import { ILocationRepository } from "../repositories/ILocationRepository";

export default class UpdateChurchService {
  
  constructor(
    private churchRepository: IChurchRepository,
    private locationRepository: ILocationRepository
  ) {
    this.churchRepository = churchRepository;
    this.locationRepository = locationRepository;
  }

  public async execute(dataChurch: IUpdateChurchDTO, dataLocation: IUpdateLocationDTO) : Promise<Church | undefined> {
    if (confirmIsDate(dataChurch.date))
      dataChurch.date = new Date(dataChurch.date)
    else 
      throw new Error("Date format is incorrect (yyyy-mm-dd)")    
    
    const church = await this.churchRepository.findById(dataChurch.id_church);
    
    if(!church) 
      throw new Error("Church doesn't exist")

    dataLocation.id_location = church.id_location;

    const location = await this.locationRepository.findByCep(dataLocation.cep)

    if (location)
      throw new Error("Location already exists with this CEP")

    const newLocation = await this.locationRepository.update(dataLocation);

    if (!newLocation)
      throw new Error("Location doesn't update")
    
    const newChurch = await this.churchRepository.update(dataChurch);

    if (!newChurch)
      throw new Error("Church doesn't update")

    return newChurch;
  }
}