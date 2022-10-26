import { IMember } from "../../../entities/IMember";
import NoExistError from "../../../shared/errors/NoExistError";
import { IMemberRepository } from "../repositories/IMemberRepository";
import { IUserRepository } from "../repositories/IUserRepository";

export default class DeleteMemberService {
  constructor(private memberRepository: IMemberRepository, private userRepository : IUserRepository) {
    this.memberRepository = memberRepository;
    this.userRepository = userRepository;
  }

  public async execute(id_member : number) : Promise<IMember | undefined> {
    const member = await this.memberRepository.findById(id_member);

    if(!member)
      throw new NoExistError("member")
    
    const isMemberDeleted = await this.memberRepository.delete(id_member);

    if (!isMemberDeleted)
      throw new Error("This members hasn't been removed")

    await this.userRepository.delete(member.id_user);
    
    return member;
  }
  
}