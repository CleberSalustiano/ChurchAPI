import { ILocation } from "../../../../entities/ILocation";
import { ICreateLocationDTO } from "../../dtos/ICreateLocationDTO";
import { IUpdateLocationDTO } from "../../dtos/IUpdateLocationDTO";
import { ILocationRepository } from "../ILocationRepository";

export default class FakeLocationRepository implements ILocationRepository {
	private locations: ILocation[] = [];

	public async create({
		cep,
		city,
		country,
		district,
		state,
		street,
	}: ICreateLocationDTO): Promise<ILocation | undefined> {
		const location: ILocation = {
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

	public async findByCep(cep: number): Promise<ILocation | undefined> {
		const location = this.locations.find((location) => location.cep === cep);

		return location;
	}

	public async delete(id_location: number): Promise<boolean> {
		const locationIndex = this.locations.findIndex(
			(location) => location.id === id_location
		);

		if (locationIndex === -1) return false;

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
	}: IUpdateLocationDTO): Promise<ILocation | undefined> {
		const locationIndex = this.locations.findIndex(
			(location) => location.id === id_location
		);

		if (locationIndex === -1) return undefined;

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
