import { Church } from ".prisma/client";
import { ICreateChurchDTO } from "../dtos/ICreateChurchDTO";
import { IChurchRepository } from "../repositories/IChurchRepository";

class CreateNewChurchService {

  constructor(
    private churchRepository: IChurchRepository
  ) {
    this.churchRepository = churchRepository;
  }

  public async execute(data: ICreateChurchDTO): Promise<Church | undefined> {
    const church = await this.churchRepository.create(data);

    return church;
  }

}

export default CreateNewChurchService;