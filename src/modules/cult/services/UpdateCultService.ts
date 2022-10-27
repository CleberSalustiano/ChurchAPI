import DateError from "../../../shared/errors/DateError";
import NoExistError from "../../../shared/errors/NoExistError";
import { confirmIsDate } from "../../../shared/utils/confirmIsDate";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
import { IUpdateCultDTO } from "../dtos/IUpdateCultDTO";
import { ICultRepository } from "../repositories/ICultRepository";

export default class UpdateCultService {
  constructor(
    private cultRepository: ICultRepository,
    private churchRepository: IChurchRepository
  ) {
    this.cultRepository = cultRepository;
    this.churchRepository = churchRepository;
  }

  async execute({ date, id_church, id_cult, theme }: IUpdateCultDTO) {
    const cult = await this.cultRepository.findById(id_cult);

    if (!cult) throw new NoExistError("cult");

    if (!confirmIsDate(date)) throw new DateError();
    
    const church = await this.churchRepository.findById(id_church);

    if (!church) throw new NoExistError("church");

    const cultUpdated = await this.cultRepository.update({
      date,
      id_church,
      id_cult,
      theme,
    });
    if (!cultUpdated) throw new Error("This cult wasn't created");

    return cultUpdated;
  }
}
