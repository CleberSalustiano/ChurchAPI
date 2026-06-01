import nodemailer from "nodemailer";
import mailConfig from "../config/mail";
import IMailProvider, { ISendMailDTO } from "./IMailProvider";

export default class SmtpMailProvider implements IMailProvider {
  private transporter = nodemailer.createTransport({
    host: mailConfig.smtp.host,
    port: mailConfig.smtp.port,
    secure: mailConfig.smtp.secure,
    auth:
      mailConfig.smtp.user && mailConfig.smtp.password
        ? {
            user: mailConfig.smtp.user,
            pass: mailConfig.smtp.password,
          }
        : undefined,
  });

  async sendMail({ to, subject, text, html }: ISendMailDTO): Promise<void> {
    await this.transporter.sendMail({
      from: mailConfig.from,
      to,
      subject,
      text,
      html,
    });
  }
}
