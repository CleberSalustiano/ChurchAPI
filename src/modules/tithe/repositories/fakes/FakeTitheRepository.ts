import { ITithe } from "../../../../entities/ITithe";
import { ICreateTitheDTO } from "../../dtos/ICreateTitheDTO";
import { IUpdateTitheDTO } from "../../dtos/IUpdateTitheDTO";
import { ITitheRepository } from "../ITitheRepository";

export default class FakeTitheRepository implements ITitheRepository {
  tithes: ITithe[] = [];

  public async create({
    id_special_offer,
    month,
    year,
  }: ICreateTitheDTO): Promise<ITithe | undefined> {
    const tithe: ITithe = {
      deletedAt: null,
      id: this.tithes.length,
      id_special_offer,
      month,
      year,
    };

    this.tithes.push(tithe);

    return tithe;
  }

  public async findAll(): Promise<ITithe[] | undefined> {
    return this.tithes.filter((tithe) => !tithe.deletedAt);
  }

  public async findAllByChurch(_id_church: number): Promise<ITithe[] | undefined> {
    return this.tithes.filter((tithe) => !tithe.deletedAt);
  }

  public async findById(id_tithe: number): Promise<ITithe | undefined> {
    const tithe = this.tithes.find(
      (item) => item.id === id_tithe && !item.deletedAt
    );

    return tithe;
  }

  public async update({
    id_tithe,
    month,
    year,
  }: IUpdateTitheDTO): Promise<ITithe | undefined> {
    const titheIndex = this.tithes.findIndex(
      (item) => item.id === id_tithe && !item.deletedAt
    );

    if (titheIndex === -1) return undefined;
    const tithe = this.tithes[titheIndex];
    tithe.month = month;
    tithe.year = year;

    this.tithes.splice(titheIndex, 1, tithe);

    return tithe;
  }

  public async delete(id_tithe: number): Promise<boolean> {
    const titheIndex = this.tithes.findIndex(
      (item) => item.id === id_tithe && !item.deletedAt
    );

    if (titheIndex === -1) return false;

    const tithe = this.tithes[titheIndex];
    tithe.deletedAt = new Date();
    this.tithes.splice(titheIndex,1, tithe);

    return true;     
  }
}
