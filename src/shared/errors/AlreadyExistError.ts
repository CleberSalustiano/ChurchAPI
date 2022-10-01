export default class AlreadyExistError extends Error{
  constructor(name: string) {
    super();
    this.message = `This ${name} already exists`;
  }
}