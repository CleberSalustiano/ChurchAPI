import AppError from "../../../shared/errors/AppError";
import NoExistError from "../../../shared/errors/NoExistError";
import FakeUserRepository from "../repositories/fakes/FakeUserRepository";
import UpdateUserPasswordService from "./UpdateUserPasswordService";

describe("Update user password", () => {
  it("should be able to update a user password", async () => {
    const userRepository = new FakeUserRepository();
    const service = new UpdateUserPasswordService(userRepository);

    await userRepository.create({ login: "member-login", password: "12345678" });

    const user = await service.execute(0, "87654321");

    expect(user?.password).toBe("87654321");
  });

  it("should not update password for a user that does not exist", async () => {
    const userRepository = new FakeUserRepository();
    const service = new UpdateUserPasswordService(userRepository);

    await expect(service.execute(0, "87654321")).rejects.toThrowError(
      NoExistError
    );
  });

  it("should validate minimum password length", async () => {
    const userRepository = new FakeUserRepository();
    const service = new UpdateUserPasswordService(userRepository);

    await userRepository.create({ login: "member-login", password: "12345678" });

    await expect(service.execute(0, "123")).rejects.toThrowError(AppError);
  });
});
