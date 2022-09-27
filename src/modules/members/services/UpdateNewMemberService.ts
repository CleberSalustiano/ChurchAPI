import { confirmIsDate } from "../../../shared/utils/confirmIsDate";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
import { IUpdateMemberDTO } from "../dtos/IUpdateMemberDTO";
import { IMemberRepository } from "../repositories/IMemberRepository";

export default class UpdateNewMemberService {
  constructor(private memberRepository: IMemberRepository, private churchRepository: IChurchRepository) {
    this.memberRepository = memberRepository;
    this.churchRepository = churchRepository;
  }

  async execute(dataMember: IUpdateMemberDTO) {
    const member = await this.memberRepository.findById(dataMember.id_member);

    if (!member) 
      throw new Error("This member doesn't exist");
    
    const church = await this.churchRepository.findById(dataMember.id_church);

    if (!church) 
      throw new Error("This church doesn't exist");
    
    if (confirmIsDate(dataMember.birth_date))
      dataMember.birth_date = new Date(dataMember.birth_date);
    else throw new Error("Birth date format is incorrect (yyyy-mm-dd)");

    if (confirmIsDate(dataMember.batism_date))
      dataMember.batism_date = new Date(dataMember.batism_date);
    else throw new Error("Batism date format is incorrect (yyyy-mm-dd)");
    
    if (dataMember.cpf){
      const memberCpf = await this.memberRepository.findByCPF(dataMember.cpf)

      if (memberCpf && memberCpf !== member) {
        throw new Error("CPF already exists")
      } else if (member.cpf !== dataMember.cpf) {
        if (dataMember.cpf.toString().length !== 11)
          throw new Error("CPF format is incorrect");
      }  
      dataMember.cpf = undefined;      
    }

    if (dataMember.birth_date.toString() === dataMember.batism_date.toString())
      throw new Error("Birth date and Batism date can not be equals");

    const newMember = await this.memberRepository.update(dataMember);
    
    return newMember;
  }

}