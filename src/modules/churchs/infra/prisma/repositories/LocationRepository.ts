import { Church, Location } from ".prisma/client";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateLocationDTO } from "../../../dtos/ICreateLocationDTO";
import { IUpdateLocationDTO } from "../../../dtos/IUpdateLocationDTO";
import { ILocationRepository } from "../../../repositories/ILocationRepository";

export default class LocationRepository implements ILocationRepository {
	async create({
		cep,
		city,
		country,
		district,
		state,
		street,
	}: ICreateLocationDTO): Promise<Location | undefined> {
		const location = await prismaClient.location.create({
			data: { cep, city, country, district, state, street },
		});
		return location;
	}

	async findByCep(cep: number): Promise<Location | undefined> {
		const location = await prismaClient.location.findUnique({ where: { cep } });

		if (!location) return undefined;
		else return location;
	}

	async delete(id_location: number): Promise<boolean> {
		const location = await prismaClient.location.delete({
			where: { id: id_location },
		});

		if (location) return true;
		else return false;
	}

	async update({
		cep,
		city,
		country,
		district,
		id_location,
		state,
		street,
	}: IUpdateLocationDTO): Promise<Location | undefined> {
		const location = await prismaClient.location.update({
			where: { id: id_location },
			data: {cep, city, country, district, state, street},
		});

		return location;
	}
}
