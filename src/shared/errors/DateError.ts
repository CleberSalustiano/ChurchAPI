import AppError from "./AppError";

export default class DateError extends AppError {
  constructor() {
    super("Date format is incorrect (yyyy-mm-dd)", 400);
  }
}
