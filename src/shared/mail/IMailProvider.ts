export interface ISendMailDTO {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export default interface IMailProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
}
