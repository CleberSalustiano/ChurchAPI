import NoExistError from "../../../shared/errors/NoExistError";
import { IChurchRepository } from "../../churchs/repositories/IChurchRepository";
import { ICultRepository } from "../repositories/ICultRepository";

export default class DeleteCultService {

  constructor(private cultRepository : ICultRepository) {
    this.cultRepository = cultRepository;
  }
  async execute(id_cult : number) {
    const cult = await this.cultRepository.findById(id_cult);

    if (!cult) throw new NoExistError("cult");

    const isCultDeleted = await this.cultRepository.delete(id_cult);

    if (!isCultDeleted) throw new Error("This cult wasn't deleted")

    return cult;
    
  }

}