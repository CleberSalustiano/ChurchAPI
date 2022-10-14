import AlreadyExistError from "../../../shared/errors/AlreadyExistError";
import NoExistError from "../../../shared/errors/NoExistError";
import { confirmIsDate } from "../../../shared/utils/confirmIsDate";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
import { IUpdateMemberDTO } from "../dtos/IUpdateMemberDTO";
import { IMemberRepository } from "../repositories/IMemberRepository";

export default class UpdateMemberService {
  constructor(
    private memberRepository: IMemberRepository,
    private churchRepository: IChurchRepository
  ) {
    this.memberRepository = memberRepository;
    this.churchRepository = churchRepository;
  }

  async execute(dataMember: IUpdateMemberDTO) {
    const member = await this.memberRepository.findById(dataMember.id_member);

    if (!member) throw new NoExistError("member");

    const church = await this.churchRepository.findById(dataMember.id_church);

    if (!church) throw new NoExistError("church");

    if (!confirmIsDate(dataMember.birth_date))
      throw new Error("Birth date format is incorrect (yyyy-mm-dd)");

    if (!confirmIsDate(dataMember.batism_date))
      throw new Error("Batism date format is incorrect (yyyy-mm-dd)");
      
    if (dataMember.cpf) {
      const memberCpf = await this.memberRepository.findByCPF(dataMember.cpf);

      if (memberCpf && memberCpf.id !== member.id) {
        throw new AlreadyExistError("CPF");
      } else if (member.cpf !== dataMember.cpf) {
        if (dataMember.cpf.toString().length !== 11)
          throw new Error("CPF format is incorrect");
      }
    }

    if (dataMember.birth_date.toString() === dataMember.batism_date.toString())
      throw new Error("Birth date and Batism date can not be equals");

    const newMember = await this.memberRepository.update(dataMember);

    return newMember;
  }
}
