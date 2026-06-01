import { randomBytes } from "crypto";
import mailConfig from "../../../shared/config/mail";
import IMailProvider from "../../../shared/mail/IMailProvider";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { IPasswordResetTokenRepository } from "../repositories/IPasswordResetTokenRepository";

interface IResponse {
  message: string;
  resetToken?: string;
}

export default class RequestPasswordResetService {
  constructor(
    private memberRepository: IMemberRepository,
    private passwordResetTokenRepository: IPasswordResetTokenRepository,
    private mailProvider: IMailProvider
  ) {
    this.memberRepository = memberRepository;
    this.passwordResetTokenRepository = passwordResetTokenRepository;
    this.mailProvider = mailProvider;
  }

  async execute(email: string): Promise<IResponse> {
    const message =
      "If the email exists, a password reset token has been generated";
    const member = await this.memberRepository.findByEmail(email);

    if (!member) {
      return { message };
    }

    await this.passwordResetTokenRepository.deleteByUserId(member.id_user);

    const resetToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.passwordResetTokenRepository.create(
      member.id_user,
      resetToken,
      expiresAt
    );

    const resetUrl = new URL(mailConfig.passwordResetUrlBase);
    resetUrl.searchParams.set("token", resetToken);

    await this.mailProvider.sendMail({
      to: member.email,
      subject: "Password reset request",
      text: `A password reset was requested for your account. Use this link to continue: ${resetUrl.toString()}`,
      html: `<p>A password reset was requested for your account.</p><p>Use this link to continue:</p><p><a href="${resetUrl.toString()}">${resetUrl.toString()}</a></p>`,
    });

    return {
      message,
      ...(mailConfig.exposeResetTokenInResponse ? { resetToken } : {}),
    };
  }
}
