import { Church } from ".prisma/client";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { ICreateChurchDTO } from "../../../dtos/ICreateChurchDTO";
import { IChurchRepository } from "../../../repositories/IChurchRepository";

export default class ChurchRepository implements IChurchRepository {
  async create({ date, street, cep, city, country, district, state }: ICreateChurchDTO): Promise<Church | undefined> {
    try {
      //recreate this logic, don't create new locations, or churchs with same date.
      const churchLocation = await prismaClient.location.create({
        data: { cep, city, country, district, state, street }
      })

      const church = await prismaClient.church.create({
        data: { creationDate: date, id_location: churchLocation.id }
      })

      return church;
    } catch (error) {
      console.log(error)
    }
  }
}