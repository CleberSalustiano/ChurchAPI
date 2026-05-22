import { IChurch } from "../../../../entities/IChurch";
import { ICreateChurchDTO } from "../../dtos/ICreateChurchDTO";
import { IUpdateChurchDTO } from "../../dtos/IUpdateChurchDTO";
import { IChurchRepository } from "../IChurchRepository";

export default class FakeChurchRepository implements IChurchRepository {
	private churches: IChurch[] = [];

	public async create({
		date,
		id_location,
    parent_church_id,
    type,
	}: ICreateChurchDTO): Promise<IChurch | undefined> {
		const church: IChurch = {
			creationDate: new Date(date.toString()),
      deactivatedAt: null,
      deletedAt: null,
			id_location,
			id: this.churches.length,
      parentChurchId: parent_church_id ?? null,
      status: "ACTIVE",
      type: type ?? "BRANCH",
		};

		this.churches.push(church);

		return church;
	}

	public async findAll(): Promise<IChurch[] | undefined> {
		return this.churches;
	}

	public async findById(id_church: number): Promise<IChurch | undefined> {
		const church = this.churches.find((church) => church.id === id_church);

		return church;
	}

	public async delete(id_church: number): Promise<boolean> {
		const churchIndex = this.churches.findIndex(
			(church) => church.id === id_church
		);

		if (churchIndex === -1) {
			return false;
		}

    const church = this.churches[churchIndex];
    church.status = "DELETED";
    church.deletedAt = new Date();
    church.deactivatedAt = church.deactivatedAt ?? new Date();

		this.churches.splice(churchIndex, 1, church);

		return true;
	}

  public async deactivate(id_church: number): Promise<IChurch | undefined> {
    const churchIndex = this.churches.findIndex((church) => church.id === id_church);

    if (churchIndex === -1) return undefined;

    const church = this.churches[churchIndex];
    church.status = "INACTIVE";
    church.deactivatedAt = new Date();

    this.churches.splice(churchIndex, 1, church);

    return church;
  }

  public async reactivate(id_church: number): Promise<IChurch | undefined> {
    const churchIndex = this.churches.findIndex((church) => church.id === id_church);

    if (churchIndex === -1) return undefined;

    const church = this.churches[churchIndex];
    church.status = "ACTIVE";
    church.deactivatedAt = null;

    this.churches.splice(churchIndex, 1, church);

    return church;
  }

  public async findByLocation(id_location: number): Promise<IChurch | undefined> {
      const church = this.churches.find((church) => church.id_location === id_location && church.status !== "DELETED");

      return church;
  }

  public async update({date, id_church}: IUpdateChurchDTO): Promise<IChurch | undefined> {
    const churchIndex = this.churches.findIndex(
			(church) => church.id === id_church
		);

		if (churchIndex === -1) {
			return undefined;
		}

    const church = this.churches[churchIndex];
    church.creationDate = new Date(date.toString());

		this.churches.splice(churchIndex, 1, church);

    return church;
  }
  public async findFirstChurch(): Promise<IChurch | undefined> {
    const church = this.churches[0];

    return church;
  }

  public async findHeadquarter(): Promise<IChurch | undefined> {
    return this.churches.find(
      (church) => church.type === "HEADQUARTER" && church.status !== "DELETED"
    );
  }
}
