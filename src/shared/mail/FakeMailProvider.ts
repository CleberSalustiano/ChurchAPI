import IMailProvider, { ISendMailDTO } from "./IMailProvider";

export default class FakeMailProvider implements IMailProvider {
  public messages: ISendMailDTO[] = [];

  async sendMail(data: ISendMailDTO): Promise<void> {
    this.messages.push(data);
  }
}
