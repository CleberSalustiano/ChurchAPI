import AppError from "../../../shared/errors/AppError";
import NoExistError from "../../../shared/errors/NoExistError";
import { verifyPassword } from "../../../shared/security/password";
import FakeUserRepository from "../repositories/fakes/FakeUserRepository";
import UpdateUserPasswordService from "./UpdateUserPasswordService";

describe("Update user password", () => {
  it("should be able to update a user password", async () => {
    const userRepository = new FakeUserRepository();
    const service = new UpdateUserPasswordService(userRepository);

    await userRepository.create({ login: "member-login", password: "12345678" });

    const user = await service.execute(0, "NovaSenha1");

    expect(user?.password).not.toBe("NovaSenha1");
    await expect(verifyPassword("NovaSenha1", user!.password)).resolves.toBe(
      true
    );
  });

  it("should not update password for a user that does not exist", async () => {
    const userRepository = new FakeUserRepository();
    const service = new UpdateUserPasswordService(userRepository);

    await expect(service.execute(0, "NovaSenha1")).rejects.toThrowError(
      NoExistError
    );
  });

  it("should validate minimum password length", async () => {
    const userRepository = new FakeUserRepository();
    const service = new UpdateUserPasswordService(userRepository);

    await userRepository.create({ login: "member-login", password: "12345678" });

    await expect(service.execute(0, "123456")).rejects.toThrowError(AppError);
  });
});
