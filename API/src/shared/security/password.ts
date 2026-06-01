import { compare, hash } from "bcryptjs";
import AppError from "../errors/AppError";

export const PASSWORD_MIN_LENGTH = 6;
export const MEMBER_DEFAULT_PASSWORD = "1234";
const PASSWORD_SALT_ROUNDS = 10;

function normalizeCpf(cpf: bigint | number | string | null | undefined) {
  if (cpf === null || cpf === undefined) {
    return "";
  }

  return cpf.toString().replace(/\D/g, "");
}

export function isTemporaryMemberPassword(
  password: string,
  cpf: bigint | number | string
) {
  const normalizedPassword = password.trim();

  return (
    normalizedPassword === MEMBER_DEFAULT_PASSWORD ||
    normalizedPassword === normalizeCpf(cpf)
  );
}

export async function hasTemporaryMemberPassword(
  hashedPassword: string,
  cpf: bigint | number | string
) {
  const cpfPassword = normalizeCpf(cpf);

  try {
    if (await compare(MEMBER_DEFAULT_PASSWORD, hashedPassword)) {
      return true;
    }

    return compare(cpfPassword, hashedPassword);
  } catch {
    return false;
  }
}

export function validatePasswordPolicy(password: string) {
  const normalizedPassword = password.trim();

  if (normalizedPassword.length < PASSWORD_MIN_LENGTH) {
    throw new AppError(
      `Password must have at least ${PASSWORD_MIN_LENGTH} characters`,
      400
    );
  }

  if (!/[A-Za-z]/.test(normalizedPassword)) {
    throw new AppError(
      "Password must contain at least one letter",
      400
    );
  }

  if (!/\d/.test(normalizedPassword)) {
    throw new AppError(
      "Password must contain at least one number",
      400
    );
  }
}

export function resolveInitialMemberPassword(
  cpf: bigint | number | string,
  password?: string
) {
  const cpfPassword = normalizeCpf(cpf);
  const normalizedPassword = password?.trim();

  if (!normalizedPassword) {
    return cpfPassword;
  }

  if (isTemporaryMemberPassword(normalizedPassword, cpf)) {
    return normalizedPassword;
  }

  throw new AppError(
    "Initial member password must be the member CPF or 1234",
    400
  );
}

export async function hashPassword(
  password: string,
  options?: { skipPolicy?: boolean }
) {
  if (!options?.skipPolicy) {
    validatePasswordPolicy(password);
  }

  return hash(password, PASSWORD_SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  try {
    return compare(password, hashedPassword);
  } catch {
    return false;
  }
}

export async function verifyMemberPassword(
  password: string,
  hashedPassword: string,
  cpf: bigint | number | string
) {
  const directMatch = await verifyPassword(password, hashedPassword);

  if (directMatch) {
    return true;
  }

  if (!isTemporaryMemberPassword(password, cpf)) {
    return false;
  }

  return hasTemporaryMemberPassword(hashedPassword, cpf);
}
