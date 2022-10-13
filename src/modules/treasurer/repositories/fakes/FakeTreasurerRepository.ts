import { ITreasurer } from "../../../../entities/ITreasurer";
import { IUpdateTreasurerDTO } from "../../dtos/IUpdateTreasurerDTO";
import { ITreasurerRepository } from "../ITreasurerRepository";

export default class FakeTreasurerRepository implements ITreasurerRepository {
  private treasurers: ITreasurer[] = [];

  public async create(id_member: number): Promise<ITreasurer | undefined> {
    const treasurer: ITreasurer = {
      id: this.treasurers.length,
      id_member,
      startDate: new Date(),
    };

    this.treasurers.push(treasurer);

    return treasurer;
  }

  public async findById(id_treasurer: number): Promise<ITreasurer | undefined> {
    const treasurer = this.treasurers.find(
      (treasurer) =>
        treasurer.id === id_treasurer && treasurer.endDate === undefined
    );

    return treasurer;
  }

  public async findAllActive(): Promise<ITreasurer[] | undefined> {
    return this.treasurers;
  }

  async update(data: IUpdateTreasurerDTO): Promise<ITreasurer | undefined> {
    const treasurerIndex = this.treasurers.findIndex(
      (treasurer) => treasurer.id === data.id_treasurer
    );

    const treasurer = this.treasurers[treasurerIndex];
    treasurer.id_member = data.id_member;

    this.treasurers.splice(treasurerIndex, 1, treasurer);

    return treasurer;
  }

  async findByMember(id_member: number): Promise<ITreasurer | undefined> {
    const treasurer = this.treasurers.find(
      (treasurer) =>
        treasurer.id_member === id_member && treasurer.endDate === undefined
    );

    return treasurer;
  }

  async endTreasurer(id_treasurer: number): Promise<ITreasurer | undefined> {
    const treasurerIndex = this.treasurers.findIndex(
      (treasurer) => treasurer.id === id_treasurer
    );

    const treasurer = this.treasurers[treasurerIndex];
    treasurer.endDate = new Date();

    this.treasurers.splice(treasurerIndex, 1, treasurer);

    return treasurer;
  }
}
