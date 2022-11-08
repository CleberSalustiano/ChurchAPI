import DateError from "../../../shared/errors/DateError";
import NoExistError from "../../../shared/errors/NoExistError";
import { confirmIsDate } from "../../../shared/utils/confirmIsDate";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
import { ICreateCostDTO } from "../dtos/ICreateCostDTO";
import { ICostRepository } from "../repositories/ICostRepository";

export default class CreateNewCostService {
  constructor(
    private costRepository: ICostRepository,
    private churchRepository: IChurchRepository
  ) {
    this.costRepository = costRepository;
    this.churchRepository = churchRepository;
  }

  async execute(dataCost: ICreateCostDTO) {
    if (!confirmIsDate(dataCost.date)) throw new DateError();

    const church = await this.churchRepository.findById(dataCost.id_church);

    if (!church) throw new NoExistError("church");

    const cost = await this.costRepository.create(dataCost);

    if (!cost) throw new Error("This cost doesn't created")

    return cost;
  }
}
