import NoExistError from "../../../shared/errors/NoExistError";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
import { IUpdateCostDTO } from "../dtos/IUpdateCostDTO";
import { ICostRepository } from "../repositories/ICostRepository";

export default class UpdateCostService {
  constructor(
    private costRepository: ICostRepository,
  ) {
    this.costRepository = costRepository;
  }

  async execute(dataCost: IUpdateCostDTO) {
    const cost = await this.costRepository.findById(dataCost.id_cost);

    if (!cost) throw new NoExistError("cost");

    const newCost = await this.costRepository.update(dataCost);

    if (!newCost) throw new Error("This cost doesn't created")

    return cost;
  }
}
