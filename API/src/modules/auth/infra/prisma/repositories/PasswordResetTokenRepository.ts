import { IPasswordResetToken } from "../../../../../entities/IPasswordResetToken";
import prismaClient from "../../../../../shared/infra/database/prismaClient";
import { IPasswordResetTokenRepository } from "../../../repositories/IPasswordResetTokenRepository";

export default class PasswordResetTokenRepository
  implements IPasswordResetTokenRepository
{
  async create(
    userId: number,
    token: string,
    expiresAt: Date
  ): Promise<IPasswordResetToken | undefined> {
    const passwordResetToken = await prismaClient.passwordResetToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return passwordResetToken;
  }

  async findByToken(token: string): Promise<IPasswordResetToken | undefined> {
    const passwordResetToken = await prismaClient.passwordResetToken.findFirst({
      where: { token },
    });

    return passwordResetToken ?? undefined;
  }

  async markAsUsed(id: number): Promise<IPasswordResetToken | undefined> {
    const passwordResetToken = await prismaClient.passwordResetToken.update({
      where: { id },
      data: {
        usedAt: new Date(),
      },
    });

    return passwordResetToken;
  }

  async deleteByUserId(userId: number): Promise<void> {
    await prismaClient.passwordResetToken.deleteMany({
      where: { userId, usedAt: null },
    });
  }
}
