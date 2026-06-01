import { IMember } from "../../../entities/IMember";
import AppError from "../../../shared/errors/AppError";
import NoExistError from "../../../shared/errors/NoExistError";
import { IManagerRepository } from "../../manager/repositories/IManagerRepository";
import { IMemberRepository } from "../repositories/IMemberRepository";
import { IUserRepository } from "../repositories/IUserRepository";

export default class DeleteMemberService {
  constructor(
    private memberRepository: IMemberRepository,
    private userRepository : IUserRepository,
    private managerRepository: IManagerRepository
  ) {
    this.memberRepository = memberRepository;
    this.userRepository = userRepository;
    this.managerRepository = managerRepository;
  }

  public async execute(id_member : number) : Promise<IMember | undefined> {
    const member = await this.memberRepository.findById(id_member);

    if(!member)
      throw new NoExistError("member")

    const activeManagerAssignment = await this.managerRepository.findByMember(id_member);

    if (activeManagerAssignment) {
      const churchManagers =
        (await this.managerRepository.findAllbyChurch(activeManagerAssignment.id_church)) ?? [];

      if (churchManagers.length <= 1) {
        throw new AppError(
          "Cannot inactivate the only active manager of a church. Replace the manager first.",
          400
        );
      }

      await this.managerRepository.endManager(activeManagerAssignment.id);
    }
    
    const isMemberDeleted = await this.memberRepository.delete(id_member);

    if (!isMemberDeleted)
      throw new Error("This members hasn't been removed")

    await this.userRepository.delete(member.id_user);
    
    return member;
  }
  
}
