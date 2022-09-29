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
      throw new Error("This church doesn't exist")
    
    const member = await this.memberRepository.findById(dataManager.id_member);

    if (!member)
      throw new Error("This member doesn't exist")
    
    // TODO: condition to verificate that have another Manager then doesn't have DATEEND. 
    // If have but is less then 3 or equals, no problem. 
    // But if greater then 3 throw a new Error.

    const manager = await this.managerRepository.create(dataManager);

    return manager;
  }
}