import mailConfig from "../../../shared/config/mail";
import FakeMailProvider from "../../../shared/mail/FakeMailProvider";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakePasswordResetTokenRepository from "../repositories/fakes/FakePasswordResetTokenRepository";
import RequestPasswordResetService from "./RequestPasswordResetService";

describe("Request password reset", () => {
  const originalExposeResetTokenInResponse =
    mailConfig.exposeResetTokenInResponse;

  afterEach(() => {
    (mailConfig as { exposeResetTokenInResponse: boolean }).exposeResetTokenInResponse =
      originalExposeResetTokenInResponse;
  });

  it("should generate a reset token for an existing member email", async () => {
    const memberRepository = new FakeMemberRepository();
    const passwordResetTokenRepository = new FakePasswordResetTokenRepository();
    const mailProvider = new FakeMailProvider();
    const service = new RequestPasswordResetService(
      memberRepository,
      passwordResetTokenRepository,
      mailProvider
    );

    await memberRepository.create({
      id_church: 1,
      batism_date: "2020-10-10",
      birth_date: "1990-01-10",
      cpf: BigInt(12345678901),
      email: "member@email.com",
      name: "Member Name",
      rg: 123123123,
      ecclesiasticalRole: "Member",
      id_user: 1,
    });

    const response = await service.execute("member@email.com");

    expect(response.message).toContain("password reset token");
    expect(response.resetToken).toBeUndefined();
    expect(mailProvider.messages).toHaveLength(1);
    expect(mailProvider.messages[0].to).toBe("member@email.com");
  });

  it("should return a generic response for an unknown email", async () => {
    const memberRepository = new FakeMemberRepository();
    const passwordResetTokenRepository = new FakePasswordResetTokenRepository();
    const mailProvider = new FakeMailProvider();
    const service = new RequestPasswordResetService(
      memberRepository,
      passwordResetTokenRepository,
      mailProvider
    );

    const response = await service.execute("missing@email.com");

    expect(response).toEqual({
      message: "If the email exists, a password reset token has been generated",
    });
    expect(mailProvider.messages).toHaveLength(0);
  });

  it("should optionally expose the reset token in the response", async () => {
    const memberRepository = new FakeMemberRepository();
    const passwordResetTokenRepository = new FakePasswordResetTokenRepository();
    const mailProvider = new FakeMailProvider();
    const service = new RequestPasswordResetService(
      memberRepository,
      passwordResetTokenRepository,
      mailProvider
    );

    await memberRepository.create({
      id_church: 1,
      batism_date: "2020-10-10",
      birth_date: "1990-01-10",
      cpf: BigInt(12345678901),
      email: "member@email.com",
      name: "Member Name",
      rg: 123123123,
      ecclesiasticalRole: "Member",
      id_user: 1,
    });

    (mailConfig as { exposeResetTokenInResponse: boolean }).exposeResetTokenInResponse =
      true;

    const response = await service.execute("member@email.com");

    expect(response.resetToken).toBeTruthy();
  });
});
