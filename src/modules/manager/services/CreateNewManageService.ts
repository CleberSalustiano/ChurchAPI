import NoExistError from "../../../shared/errors/NoExistError";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
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
    
    const managersChurch = await this.managerRepository.findAllbyChurch(dataManager.id_church);

    if(managersChurch){
      const managersChurchActive = managersChurch.filter(manager => !(manager.dateEnd) )
      
      if (managersChurchActive.length >= 3)
        throw new Error("This church have many managers, please delete someone or set dateEnd"); 
    }
    
    const manager = await this.managerRepository.create(dataManager);

    return manager;
  }
}