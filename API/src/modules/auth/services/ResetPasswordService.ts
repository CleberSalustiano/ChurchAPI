import AppError from "../../../shared/errors/AppError";
import { hashPassword } from "../../../shared/security/password";
import { IPasswordResetTokenRepository } from "../repositories/IPasswordResetTokenRepository";
import { IUserRepository } from "../../members/repositories/IUserRepository";

export default class ResetPasswordService {
  constructor(
    private passwordResetTokenRepository: IPasswordResetTokenRepository,
    private userRepository: IUserRepository
  ) {
    this.passwordResetTokenRepository = passwordResetTokenRepository;
    this.userRepository = userRepository;
  }

  async execute(token: string, password: string) {
    const passwordResetToken =
      await this.passwordResetTokenRepository.findByToken(token);

    if (!passwordResetToken || passwordResetToken.usedAt) {
      throw new AppError("Invalid password reset token", 400);
    }

    if (passwordResetToken.expiresAt.getTime() < Date.now()) {
      throw new AppError("Password reset token has expired", 400);
    }

    const user = await this.userRepository.findById(passwordResetToken.userId);

    if (!user) {
      throw new AppError("User not found for password reset", 404);
    }

    const hashedPassword = await hashPassword(password);

    const updatedUser = await this.userRepository.updatePassword({
      id_user: user.id,
      password: hashedPassword,
    });

    await this.passwordResetTokenRepository.markAsUsed(passwordResetToken.id);

    return updatedUser;
  }
}
