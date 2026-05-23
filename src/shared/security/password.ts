import { compare, hash } from "bcryptjs";
import AppError from "../errors/AppError";

export const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_SALT_ROUNDS = 10;

export function validatePasswordPolicy(password: string) {
  if (password.trim().length < PASSWORD_MIN_LENGTH) {
    throw new AppError(
      `Password must have at least ${PASSWORD_MIN_LENGTH} characters`,
      400
    );
  }
}

export async function hashPassword(password: string) {
  validatePasswordPolicy(password);

  return hash(password, PASSWORD_SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}
