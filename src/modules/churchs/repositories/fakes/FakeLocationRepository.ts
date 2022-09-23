import { Location } from "@prisma/client";
import { ICreateLocationDTO } from "../../dtos/ICreateLocationDTO";
import { IUpdateLocationDTO } from "../../dtos/IUpdateLocationDTO";
import { ILocationRepository } from "../ILocationRepository";

export default class FakeLocationRepository implements ILocationRepository {
	private locations: Location[] = [];

	public async create({
		cep,
		city,
		country,
		district,
		state,
		street,
	}: ICreateLocationDTO): Promise<Location | undefined> {
		const location: Location = {
			cep,
			city,
			country,
			district,
			state,
			street,
			id: this.locations.length,
		};

		this.locations.push(location);

		return location;
	}

	public async findByCep(cep: number): Promise<Location | undefined> {
		const location = this.locations.find((location) => location.cep === cep);

		return location;
	}

	public async delete(id_location: number): Promise<boolean> {
		const locationIndex = this.locations.findIndex(
			(location) => location.id === id_location
		);

		if (!locationIndex) return false;

		const location = this.locations.splice(locationIndex, 1);

		if (location) return true;

		return false;
	}

	public async update({
		cep,
		city,
		country,
		district,
		id_location,
		state,
		street,
	}: IUpdateLocationDTO): Promise<Location | undefined> {
		const locationIndex = this.locations.findIndex(
			(location) => location.id === id_location
		);

		if (!locationIndex) return undefined;

		const location = this.locations[locationIndex];
		location.cep = cep;
		location.city = city;
		location.country = country;
		location.district = district;
		location.state = state;
		location.street = street;

		this.locations.splice(locationIndex, 1, location);

    return location;
	}
}
