import AlreadyExistError from "../../../shared/errors/AlreadyExistError";
import AppError from "../../../shared/errors/AppError";
import NoExistError from "../../../shared/errors/NoExistError";
import { IChurchRepository } from "../../churches/repositories/IChurchRepository";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { ICreateManagerDTO } from "../dtos/ICreateManagerDTO";
import { IManagerRepository } from "../repositories/IManagerRepository";

export default class CreateNewManagerService {
  constructor(private memberRepository: IMemberRepository, private churchRepository: IChurchRepository, private managerRepository:IManagerRepository) {
    this.churchRepository = churchRepository;
    this.managerRepository = managerRepository;
    this.memberRepository = memberRepository;
  }

  public async execute(dataManager: ICreateManagerDTO) {
    const church = await this.churchRepository.findById(dataManager.id_church);

    if (!church)
      throw new NoExistError("church");
    
    const member = await this.memberRepository.findById(dataManager.id_member);

    if (!member)
      throw new NoExistError("member")

    if (member.id_church !== dataManager.id_church)
      throw new AppError(
        "Member must belong to the same church as the manager assignment",
        400
      );

    const managerExists = await this.managerRepository.findByMember(dataManager.id_member);

    if (managerExists)
      throw new AlreadyExistError("member with manager title")


    const managersChurch = await this.managerRepository.findAllbyChurch(dataManager.id_church);

    if(managersChurch){
      if (managersChurch.length >= 3)
        throw new Error("This church have many managers, please delete someone or set dateEnd"); 
    }
    
    const manager = await this.managerRepository.create(dataManager);

    return manager;
  }
}
