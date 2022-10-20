import { ITethe } from "../../../../entities/ITethe";
import { ICreateTetheDTO } from "../../dtos/ICreateTetheDTO";
import { ITetheRepository } from "../ITetheRepository";

export default class FakeTetheRepository implements ITetheRepository{
  
  tethes: ITethe[] = [];

  public async create({id_special_offer, month, year}: ICreateTetheDTO): Promise<ITethe | undefined> {
    const tethe : ITethe = {
      id: this.tethes.length,
      id_special_offer,
      month,
      year
    }

    this.tethes.push(tethe);

    return tethe;
  }

  public async findAll(): Promise<ITethe[] | undefined> {
    return this.tethes;
  }

  public async findById(id_tethe: number): Promise<ITethe | undefined> {
    const tethe = this.tethes.find((tethe) => tethe.id === id_tethe);
    
    return tethe;
  }
}