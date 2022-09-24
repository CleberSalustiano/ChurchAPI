import { Church } from "@prisma/client";
import { ICreateChurchDTO } from "../../dtos/ICreateChurchDTO";
import { IUpdateChurchDTO } from "../../dtos/IUpdateChurchDTO";
import { IChurchRepository } from "../IChurchRepository";

export default class FakeChurchRepository implements IChurchRepository {
	private churchs: Church[] = [];

	public async create({
		date,
		id_location,
	}: ICreateChurchDTO): Promise<Church | undefined> {
		const church: Church = {
			creationDate: date,
			id_location,
			id: this.churchs.length,
			id_manager: null,
		};

		this.churchs.push(church);

		return church;
	}

	public async findAll(): Promise<Church[] | undefined> {
		return this.churchs;
	}

	public async findById(id_church: number): Promise<Church | undefined> {
		const church = this.churchs.find((church) => church.id === id_church);

		return church;
	}

	public async delete(id_church: number): Promise<boolean> {
		const churchIndex = this.churchs.findIndex(
			(church) => church.id === id_church
		);

		if (churchIndex === -1) {
			return false;
		}

		const church = this.churchs.splice(churchIndex, 1);

		if (church) return true;

		return false;
	}

  public async findByLocation(id_location: number): Promise<Church | undefined> {
      const church = this.churchs.find((church) => church.id_location === id_location);

      return church;
  }

  public async update({date, id_church}: IUpdateChurchDTO): Promise<Church | undefined> {
    const churchIndex = this.churchs.findIndex(
			(church) => church.id === id_church
		);

		if (churchIndex === -1) {
			return undefined;
		}

    const church = this.churchs[churchIndex];
    church.creationDate = date;

		this.churchs.splice(churchIndex, 1, church);

    return church;
  }
}
