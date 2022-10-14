import AlreadyExistError from "../../../shared/errors/AlreadyExistError";
import NoExistError from "../../../shared/errors/NoExistError";
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
      throw new AlreadyExistError("member with this CEP");


    if (dataMember.id_church === undefined)
      throw new Error("id_church pass undefined");

    const church = await this.churchRepository.findById(dataMember.id_church);
    if (!church) throw new NoExistError("church");

    if (!confirmIsDate(dataMember.birth_date))
      throw new Error("Birth date format is incorrect (yyyy-mm-dd)");

    if (!confirmIsDate(dataMember.batism_date))
      throw new Error("Batism date format is incorrect (yyyy-mm-dd)");

    if (dataMember.cpf.toString().length !== 11)
      throw new Error("CPF format is incorrect");

    if (dataMember.birth_date.toString() === dataMember.batism_date.toString())
      throw new Error("Birth date and Batism date can not be equals");

    const member = await this.memberRepository.create(dataMember);

    return member;
  }
}
