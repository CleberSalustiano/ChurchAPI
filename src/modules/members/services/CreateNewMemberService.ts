import { confirmIsDate } from "../../../shared/utils/confirmIsDate";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
import { ICreateMemberDTO } from "../dtos/ICreateMemberDTO";
import { IMemberRepository } from "../repositories/IMemberRepository";

export default class CreateNewMemberService {
  constructor(private memberRepository: IMemberRepository, private churchRepository: IChurchRepository) {
    this.memberRepository = memberRepository;
    this.churchRepository = churchRepository;
  }

  public async execute(dataMember: ICreateMemberDTO) {
    const existMemberCPF = await this.memberRepository.findByCPF(dataMember.cpf)
    if (existMemberCPF)
      throw new Error("Already exist a member with this CPF");


    if (dataMember.id_church === undefined)
      throw new Error("id_church pass undefined");

    const church = await this.churchRepository.findById(dataMember.id_church);
    if (!church) throw new Error("Church doesn't exist");

    if (confirmIsDate(dataMember.birth_date))
      dataMember.birth_date = new Date(dataMember.birth_date);
    else throw new Error("Birth date format is incorrect (yyyy-mm-dd)");

    if (confirmIsDate(dataMember.batism_date))
      dataMember.batism_date = new Date(dataMember.batism_date);
    else throw new Error("Batism date format is incorrect (yyyy-mm-dd)");

    if (dataMember.cpf.toString().length !== 11)
      throw new Error("CPF format is incorrect");

    if (dataMember.birth_date.toString() === dataMember.batism_date.toString())
      throw new Error("Birth date and Batism date can not be equals");

    const member = await this.memberRepository.create(dataMember);

    return member;
  }
}
