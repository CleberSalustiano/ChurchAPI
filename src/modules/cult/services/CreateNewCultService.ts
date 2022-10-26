import DateError from "../../../shared/errors/DateError";
import NoExistError from "../../../shared/errors/NoExistError";
import { confirmIsDate } from "../../../shared/utils/confirmIsDate";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
import { ICreateCultDTO } from "../dtos/ICreateCultDTO";
import { ICultRepository } from "../repositories/ICultRepository";

export default class CreateNewCultService {
  constructor(private cultRepository : ICultRepository, private churchRepository : IChurchRepository) {
    this.cultRepository = cultRepository;
    this.churchRepository = churchRepository;
  }

  async execute({date, theme, id_church}: ICreateCultDTO) {
    const church = await this.churchRepository.findById(id_church);

    if (!church) throw new NoExistError("church");

    if (confirmIsDate(date)) throw new DateError();

    const cult = await this.cultRepository.create({date, id_church, theme});

    if (!cult) throw new Error("The cult doesn't created");

    return cult
  }
}