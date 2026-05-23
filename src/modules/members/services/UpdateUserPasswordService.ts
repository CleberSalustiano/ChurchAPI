import AppError from "../../../shared/errors/AppError";
import NoExistError from "../../../shared/errors/NoExistError";
import { IUserRepository } from "../repositories/IUserRepository";

export default class UpdateUserPasswordService {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id_user: number, password: string) {
    const user = await this.userRepository.findById(id_user);

    if (!user) throw new NoExistError("user");

    if (password.trim().length < 8) {
      throw new AppError("Password must have at least 8 characters", 400);
    }

    return this.userRepository.updatePassword({ id_user, password });
  }
}
