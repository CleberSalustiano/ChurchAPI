import { randomBytes } from "crypto";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { IPasswordResetTokenRepository } from "../repositories/IPasswordResetTokenRepository";

interface IResponse {
  message: string;
  resetToken?: string;
}

export default class RequestPasswordResetService {
  constructor(
    private memberRepository: IMemberRepository,
    private passwordResetTokenRepository: IPasswordResetTokenRepository
  ) {
    this.memberRepository = memberRepository;
    this.passwordResetTokenRepository = passwordResetTokenRepository;
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

    return {
      message,
      resetToken,
    };
  }
}
