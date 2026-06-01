import { IUser } from "./IUser";

export interface IPasswordResetToken {
  id: number;
  token: string;
  userId: number;
  user?: IUser;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
}
