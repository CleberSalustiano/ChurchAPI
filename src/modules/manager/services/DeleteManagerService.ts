import NoExistError from "../../../shared/errors/NoExistError";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { IManagerRepository } from "../repositories/IManagerRepository";

export default class DeleteManagerService {
  constructor(
    private managerRepository: IManagerRepository
  ) {
    this.managerRepository = managerRepository;
  }

  async execute(id_manager: number) {
    const manager = await this.managerRepository.findById(id_manager);

    if (!manager) throw new NoExistError("manager");

    const newManager = await this.managerRepository.endManager(id_manager);

    if (newManager?.endDate === undefined)
      throw new Error("This manager doesn't deleted");

    return newManager;
  }
}
