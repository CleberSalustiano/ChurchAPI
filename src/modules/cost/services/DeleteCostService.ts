import NoExistError from "../../../shared/errors/NoExistError";
import { ICostRepository } from "../repositories/ICostRepository";

export default class DeleteCostService {
  constructor(
    private costRepository: ICostRepository,
  ) {
    this.costRepository = costRepository;
  }

  async execute(id_cost: number) {
    const cost = await this.costRepository.findById(id_cost);

    if (!cost) throw new NoExistError("cost");

    const isCostDeleted = await this.costRepository.delete(id_cost);

    if (!isCostDeleted) throw new Error("This cost wasn't deleted")

    return cost;
  }
}
