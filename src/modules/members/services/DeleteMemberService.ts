import { IMember } from "../../../entities/IMember";
import { IMemberRepository } from "../repositories/IMemberRepository";

export default class DeleteMemberService {
  constructor(private memberRepository: IMemberRepository) {
    this.memberRepository = memberRepository;
  }

  public async execute(id_member : number) : Promise<IMember | undefined> {
    const member = await this.memberRepository.findById(id_member);

    if(!member)
      throw new Error("This member doesn't exist")
    
    const isMemberDeleted = await this.memberRepository.delete(id_member);

    if (!isMemberDeleted)
      throw new Error("This members hasn't been removed")
    
    return member;
  }
  
}