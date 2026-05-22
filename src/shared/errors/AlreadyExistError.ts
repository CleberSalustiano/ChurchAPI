import AppError from "./AppError";

export default class AlreadyExistError extends AppError {
  constructor(name: string) {
    super(`This ${name} already exists`, 409);
  }
}
