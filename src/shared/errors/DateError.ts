export default class DateError extends Error {
  constructor() {
    super();
    this.message = "Date format is incorrect (yyyy-mm-dd)";
  }
}
