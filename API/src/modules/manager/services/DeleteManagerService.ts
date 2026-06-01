import AppError from "../../../shared/errors/AppError";
import NoExistError from "../../../shared/errors/NoExistError";
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

    const churchManagers =
      (await this.managerRepository.findAllbyChurch(manager.id_church)) ?? [];

    if (churchManagers.length <= 1) {
      throw new AppError(
        "Church must keep at least one active manager. Use the replacement flow.",
        400
      );
    }

    const newManager = await this.managerRepository.endManager(id_manager);

    if (newManager?.endDate === undefined)
      throw new Error("This manager doesn't deleted");

    return newManager;
  }
}
