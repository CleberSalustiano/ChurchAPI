import { ICult } from "../../../../entities/ICult";
import { ICreateCultDTO } from "../../dtos/ICreateCultDTO";
import { ICultRepository } from "../ICultRepository";

export default class FakeCultRepository implements ICultRepository {
  cults: ICult[] = [];

  public async create({
    date,
    id_church,
    theme,
  }: ICreateCultDTO): Promise<ICult | undefined> {
    const cult: ICult = {
      id: this.cults.length,
      date: new Date(date.toString()),
      id_church,
      theme,
    };

    this.cults.push(cult);

    return cult;
  }

  public async findAll(): Promise<ICult[] | undefined> {
    return this.cults;
  }

  public async findById(id_cult: number): Promise<ICult | undefined> {
    const cult = this.cults.find(cult => cult.id === id_cult);

    return cult;
  }
}
