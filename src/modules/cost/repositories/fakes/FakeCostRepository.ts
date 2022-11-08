import { ICost } from "../../../../entities/ICost";
import { ICreateCostDTO } from "../../dtos/ICreateCostDTO";
import { IUpdateCostDTO } from "../../dtos/IUpdateCostDTO";
import { ICostRepository } from "../ICostRepository";

export default class FakeCostRepository implements ICostRepository {
  private costs: ICost[] = [];

  async create({
    date,
    description,
    id_church,
    value,
  }: ICreateCostDTO): Promise<ICost | undefined> {
    const cost: ICost = {
      date: new Date(date.toString()),
      description: description.toString(),
      id_church,
      value,
      id: this.costs.length,
    };

    this.costs.push(cost);

    return cost;
  }

  async findById(id_cost: number): Promise<ICost | undefined> {
    const cost = this.costs.find((cost) => cost.id === id_cost);

    return cost;
  }

  async findAll(): Promise<ICost[] | undefined> {
    return this.costs;
  }

  async update({
    date,
    description,
    id_cost,
    value,
  }: IUpdateCostDTO): Promise<ICost | undefined> {
    const costIndex = this.costs.findIndex((cost) => cost.id === id_cost);

    const cost = this.costs[costIndex];
    cost.date = new Date(date.toString());
    cost.description = description.toString();
    cost.value = value;

    this.costs.splice(costIndex, 1, cost);

    return cost;
  }

  async delete(id_cost: number): Promise<boolean> {
    const costIndex = this.costs.findIndex((cost) => cost.id === id_cost);

    if (costIndex === -1) return false;

    this.costs.splice(costIndex, 1);

    return true;
  }
}
