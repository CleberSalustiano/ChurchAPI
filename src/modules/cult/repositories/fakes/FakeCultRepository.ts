import { ICult } from "../../../../entities/ICult";
import { ICreateCultDTO } from "../../dtos/ICreateCultDTO";
import { IUpdateCultDTO } from "../../dtos/IUpdateCultDTO";
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

  public async delete(id_cult: number): Promise<boolean> {
    const cultIndex = this.cults.findIndex(cult => cult.id === id_cult);

    const cult = this.cults.splice(cultIndex, 1);

    if (!cult) return false;

    return true;
  }

  public async update({date, id_church, id_cult, theme}: IUpdateCultDTO): Promise<ICult | undefined> {
    const cultIndex = this.cults.findIndex(cult => cult.id === id_cult);
    
    if (cultIndex === -1) return undefined

    const cult = this.cults[cultIndex];
    cult.date = new Date(date.toString());
    cult.id_church = id_church;
    cult.theme = theme;

    this.cults.splice(cultIndex, 1, cult);

    return cult;
  }
}
