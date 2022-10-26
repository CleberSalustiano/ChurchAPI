import AlreadyExistError from "../../../shared/errors/AlreadyExistError";
import DateError from "../../../shared/errors/DateError";
import NoExistError from "../../../shared/errors/NoExistError";
import { confirmIsDate } from "../../../shared/utils/confirmIsDate";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
import { IRequestCreateMemberDTO } from "../dtos/IRequestCreateMemberDTO";
import { IMemberRepository } from "../repositories/IMemberRepository";
import { IUserRepository } from "../repositories/IUserRepository";

export default class CreateNewMemberService {
  constructor(
    private memberRepository: IMemberRepository,
    private userRepository: IUserRepository,
    private churchRepository: IChurchRepository
  ) {
    this.memberRepository = memberRepository;
    this.churchRepository = churchRepository;
    this.userRepository = userRepository;
  }

  public async execute({
    batism_date,
    birth_date,
    cpf,
    email,
    id_church,
    name,
    password,
    rg,
    titleChurch,
  }: IRequestCreateMemberDTO) {
    const existMemberCPF = await this.memberRepository.findByCPF(cpf);
    if (existMemberCPF) throw new AlreadyExistError("member with this CEP");

    if (id_church === undefined) throw new Error("id_church pass undefined");

    const church = await this.churchRepository.findById(id_church);
    if (!church) throw new NoExistError("church");

    if (!confirmIsDate(birth_date)) throw new DateError();

    if (!confirmIsDate(batism_date)) throw new DateError();

    if (cpf.toString().length !== 11)
      throw new Error("CPF format is incorrect");

    if (birth_date.toString() === batism_date.toString())
      throw new Error("Birth date and Batism date can not be equals");

    const user = await this.userRepository.create({ password });

    if (!user) throw new Error("This user doesn't created");

    const member = await this.memberRepository.create({
      batism_date,
      birth_date,
      cpf,
      email,
      id_church,
      id_user: user.id,
      name,
      rg,
      titleChurch,
    });

    return member;
  }
}
