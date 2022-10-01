import NoExistError from "../../../shared/errors/NoExistError";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { IUpdateManagerDTO } from "../dtos/IUploadManagerDTO";
import { IManagerRepository } from "../repositories/IManagerRepository";

export default class UpdateManagerService {
  constructor(
    private memberRepository: IMemberRepository,
    private churchRepository: IChurchRepository,
    private managerRepository: IManagerRepository
  ) {
    this.memberRepository = memberRepository;
    this.churchRepository = churchRepository;
    this.managerRepository = managerRepository;
  }

  public async execute(dataManager: IUpdateManagerDTO) {
    const manager = await this.managerRepository.findById(
      dataManager.id_manager
    );

    if (!manager) throw new NoExistError("manager");

    const member = await this.memberRepository.findById(dataManager.id_member);

    if (!member) throw new NoExistError("member");

    const church = await this.churchRepository.findById(dataManager.id_church);

    if (!church) throw new NoExistError("church");
      
    const managerUpdated = await this.managerRepository.update(dataManager);

    if(!managerUpdated)
      throw new Error("Manager doesn't updated")

    return managerUpdated;
  }
}
