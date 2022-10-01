export default class NoExistError extends Error {
  constructor(name: string) {
    super();
    this.message = `This ${name} doesn't exist`;
  }
}
