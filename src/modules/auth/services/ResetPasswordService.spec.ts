import AppError from "../../../shared/errors/AppError";
import { verifyPassword } from "../../../shared/security/password";
import FakeUserRepository from "../../members/repositories/fakes/FakeUserRepository";
import FakePasswordResetTokenRepository from "../repositories/fakes/FakePasswordResetTokenRepository";
import ResetPasswordService from "./ResetPasswordService";

describe("Reset password", () => {
  it("should reset a password with a valid token", async () => {
    const userRepository = new FakeUserRepository();
    const passwordResetTokenRepository = new FakePasswordResetTokenRepository();
    const service = new ResetPasswordService(
      passwordResetTokenRepository,
      userRepository
    );

    await userRepository.create({
      login: "member-login",
      password: "old-password",
    });

    const token = await passwordResetTokenRepository.create(
      0,
      "valid-token",
      new Date(Date.now() + 60 * 60 * 1000)
    );

    const user = await service.execute("valid-token", "new-password-123");
    const updatedToken = await passwordResetTokenRepository.findByToken(
      token!.token
    );

    expect(user?.password).not.toBe("new-password-123");
    await expect(
      verifyPassword("new-password-123", user!.password)
    ).resolves.toBe(true);
    expect(updatedToken?.usedAt).toBeTruthy();
  });

  it("should not reset the password with an invalid token", async () => {
    const userRepository = new FakeUserRepository();
    const passwordResetTokenRepository = new FakePasswordResetTokenRepository();
    const service = new ResetPasswordService(
      passwordResetTokenRepository,
      userRepository
    );

    await expect(service.execute("invalid-token", "new-password-123")).rejects.toThrowError(
      AppError
    );
  });

  it("should not reset the password with an expired token", async () => {
    const userRepository = new FakeUserRepository();
    const passwordResetTokenRepository = new FakePasswordResetTokenRepository();
    const service = new ResetPasswordService(
      passwordResetTokenRepository,
      userRepository
    );

    await userRepository.create({
      login: "member-login",
      password: "old-password",
    });

    await passwordResetTokenRepository.create(
      0,
      "expired-token",
      new Date(Date.now() - 60 * 1000)
    );

    await expect(service.execute("expired-token", "new-password-123")).rejects.toThrowError(
      AppError
    );
  });
});
