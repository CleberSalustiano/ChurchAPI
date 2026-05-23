import NoExistError from "../../../shared/errors/NoExistError";
import { hashPassword } from "../../../shared/security/password";
import { IUserRepository } from "../repositories/IUserRepository";

export default class UpdateUserPasswordService {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id_user: number, password: string) {
    const user = await this.userRepository.findById(id_user);

    if (!user) throw new NoExistError("user");

    const hashedPassword = await hashPassword(password);

    return this.userRepository.updatePassword({
      id_user,
      password: hashedPassword,
    });
  }
}
