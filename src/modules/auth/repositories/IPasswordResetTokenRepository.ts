import { IPasswordResetToken } from "../../../entities/IPasswordResetToken";

export interface IPasswordResetTokenRepository {
  create(userId: number, token: string, expiresAt: Date): Promise<IPasswordResetToken | undefined>;
  findByToken(token: string): Promise<IPasswordResetToken | undefined>;
  markAsUsed(id: number): Promise<IPasswordResetToken | undefined>;
  deleteByUserId(userId: number): Promise<void>;
}
