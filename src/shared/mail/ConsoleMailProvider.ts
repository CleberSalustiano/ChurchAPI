import IMailProvider, { ISendMailDTO } from "./IMailProvider";

export default class ConsoleMailProvider implements IMailProvider {
  async sendMail({ to, subject, text }: ISendMailDTO): Promise<void> {
    // Local fallback so password reset remains testable without SMTP.
    console.info(
      `[mail] to=${to} subject="${subject}" body="${text.replace(/\s+/g, " ").trim()}"`
    );
  }
}
