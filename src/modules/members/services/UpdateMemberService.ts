import AlreadyExistError from "../../../shared/errors/AlreadyExistError";
import DateError from "../../../shared/errors/DateError";
import NoExistError from "../../../shared/errors/NoExistError";
import { confirmIsDate } from "../../../shared/utils/confirmIsDate";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
import { IRequestUpdateMemberDTO } from "../dtos/IRequestUpdateMemberDTO";
import { IMemberRepository } from "../repositories/IMemberRepository";
import { IUserRepository } from "../repositories/IUserRepository";

export default class UpdateMemberService {
  constructor(
    private memberRepository: IMemberRepository,
    private userRepository: IUserRepository,
    private churchRepository: IChurchRepository
  ) {
    this.memberRepository = memberRepository;
    this.userRepository = userRepository;
    this.churchRepository = churchRepository;
  }

  async execute({
    batism_date,
    birth_date,
    cpf,
    email,
    id_church,
    id_member,
    name,
    password,
    login,
    rg,
    titleChurch,
  }: IRequestUpdateMemberDTO) {
    const member = await this.memberRepository.findById(id_member);

    if (!member) throw new NoExistError("member");

    const church = await this.churchRepository.findById(id_church);

    if (!church) throw new NoExistError("church");

    if (!confirmIsDate(birth_date)) throw new DateError();

    if (!confirmIsDate(batism_date)) throw new DateError();

    if (cpf) {
      const memberCpf = await this.memberRepository.findByCPF(cpf);

      if (memberCpf && memberCpf.id !== member.id) {
        throw new AlreadyExistError("CPF");
      } else if (member.cpf !== cpf) {
        if (cpf.toString().length !== 11)
          throw new Error("CPF format is incorrect");
      }
    }

    if (birth_date.toString() === batism_date.toString())
      throw new Error("Birth date and Batism date can not be equals");

    await this.userRepository.update({id_user: member.id_user, login, password})
    
    const newMember = await this.memberRepository.update({
      batism_date,
      birth_date,
      email,
      id_church,
      id_member,
      name,
      rg,
      titleChurch,
    });

    return newMember;
  }
}
