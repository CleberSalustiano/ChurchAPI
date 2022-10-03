import { ITreasurer } from "../../../../entities/ITreasurer";
import { ITreasurerRepository } from "../ITreasurerRepository";

export default class FakeTreasurerRepository implements ITreasurerRepository{
  private treasurers : ITreasurer[] = [];

  public async create(id_member: number): Promise<ITreasurer | undefined> {
    const treasurer: ITreasurer = {
      id: this.treasurers.length,
      id_member,
      startDate: new Date()
    } 
    
    this.treasurers.push(treasurer)

    return treasurer;
  }

  public async findById(id_treasurer: number): Promise<ITreasurer | undefined> {
    const treasurer = this.treasurers.find(treasurer => treasurer.id = id_treasurer);

    return treasurer;
  }

  public async findAll(): Promise<ITreasurer[] | undefined> {
    return this.treasurers;
  }
}