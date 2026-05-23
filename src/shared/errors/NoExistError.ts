import AppError from "./AppError";

export default class NoExistError extends AppError {
  constructor(name: string) {
    super(`This ${name} doesn't exist`, 404);
  }
}
