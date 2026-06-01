import AppError from "../errors/AppError";

export function normalizeCpfDigits(cpf: bigint | number | string) {
  return cpf.toString().replace(/\D/g, "");
}

export function normalizeCpfToBigInt(cpf: bigint | number | string) {
  const digits = normalizeCpfDigits(cpf);

  if (!digits) {
    throw new AppError("CPF format is incorrect", 400);
  }

  return BigInt(digits);
}
