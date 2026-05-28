import { IPasswordResetToken } from "../../../../entities/IPasswordResetToken";
import { IPasswordResetTokenRepository } from "../IPasswordResetTokenRepository";

export default class FakePasswordResetTokenRepository
  implements IPasswordResetTokenRepository
{
  private tokens: IPasswordResetToken[] = [];

  async create(
    userId: number,
    token: string,
    expiresAt: Date
  ): Promise<IPasswordResetToken | undefined> {
    const passwordResetToken: IPasswordResetToken = {
      id: this.tokens.length,
      token,
      userId,
      expiresAt,
      createdAt: new Date(),
      usedAt: null,
    };

    this.tokens.push(passwordResetToken);

    return passwordResetToken;
  }

  async findByToken(token: string): Promise<IPasswordResetToken | undefined> {
    return this.tokens.find((item) => item.token === token);
  }

  async markAsUsed(id: number): Promise<IPasswordResetToken | undefined> {
    const tokenIndex = this.tokens.findIndex((item) => item.id === id);

    if (tokenIndex === -1) return undefined;

    const token = this.tokens[tokenIndex];
    token.usedAt = new Date();

    this.tokens.splice(tokenIndex, 1, token);

    return token;
  }

  async deleteByUserId(userId: number): Promise<void> {
    this.tokens = this.tokens.filter((item) => item.userId !== userId);
  }
}
