import AlreadyExistError from "../../../shared/errors/AlreadyExistError";
import AppError from "../../../shared/errors/AppError";
import DateError from "../../../shared/errors/DateError";
import NoExistError from "../../../shared/errors/NoExistError";
import { confirmIsDate } from "../../../shared/utils/confirmIsDate";
import { normalizeCpfDigits, normalizeCpfToBigInt } from "../../../shared/utils/normalizeCpf";
import { IChurchRepository } from "../../churches/repositories/IChurchRepository";
import { IManagerRepository } from "../../manager/repositories/IManagerRepository";
import { IRequestUpdateMemberDTO } from "../dtos/IRequestUpdateMemberDTO";
import { IMemberRepository } from "../repositories/IMemberRepository";

export default class UpdateMemberService {
  constructor(
    private memberRepository: IMemberRepository,
    private churchRepository: IChurchRepository,
    private managerRepository: IManagerRepository
  ) {
    this.memberRepository = memberRepository;
    this.churchRepository = churchRepository;
    this.managerRepository = managerRepository;
  }

  async execute({
    batism_date,
    birth_date,
    cpf,
    email,
    id_church,
    id_member,
    name,
    rg,
    ecclesiasticalRole,
  }: IRequestUpdateMemberDTO) {
    const normalizedCpf = cpf ? normalizeCpfToBigInt(cpf) : undefined;
    const normalizedCpfDigits = cpf ? normalizeCpfDigits(cpf) : undefined;
    const member = await this.memberRepository.findById(id_member);

    if (!member) throw new NoExistError("member");

    const church = await this.churchRepository.findById(id_church);

    if (!church) throw new NoExistError("church");

    if (!confirmIsDate(birth_date)) throw new DateError();

    if (!confirmIsDate(batism_date)) throw new DateError();

    if (normalizedCpf) {
      const memberCpf = await this.memberRepository.findByCPF(normalizedCpf);

      if (memberCpf && memberCpf.id !== member.id) {
        throw new AlreadyExistError("CPF");
      } else if (member.cpf !== normalizedCpf) {
        if (normalizedCpfDigits?.length !== 11)
          throw new Error("CPF format is incorrect");
      }
    }

    if (birth_date.toString() === batism_date.toString())
      throw new Error("Birth date and Batism date can not be equals");

    const activeManagerAssignment = await this.managerRepository.findByMember(id_member);

    if (activeManagerAssignment && member.id_church !== id_church) {
      throw new AppError(
        "Active managers can not be moved to another church without replacing the assignment first",
        400
      );
    }
    
    const newMember = await this.memberRepository.update({
      batism_date,
      birth_date,
      cpf: normalizedCpf,
      email,
      id_church,
      id_member,
      name,
      rg,
      ecclesiasticalRole,
    });

    return newMember;
  }
}
