import AlreadyExistError from "../../../shared/errors/AlreadyExistError";
import NoExistError from "../../../shared/errors/NoExistError";
import { IUserRepository } from "../repositories/IUserRepository";

export default class UpdateUserLoginService {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id_user: number, login: string) {
    const user = await this.userRepository.findById(id_user);

    if (!user) throw new NoExistError("user");

    const userWithSameLogin = await this.userRepository.findByLogin(login);

    if (userWithSameLogin && userWithSameLogin.id !== id_user) {
      throw new AlreadyExistError("user login");
    }

    return this.userRepository.updateLogin({ id_user, login });
  }
}
