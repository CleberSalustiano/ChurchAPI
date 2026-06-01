import AlreadyExistError from "../../../shared/errors/AlreadyExistError";
import NoExistError from "../../../shared/errors/NoExistError";
import FakeUserRepository from "../repositories/fakes/FakeUserRepository";
import UpdateUserLoginService from "./UpdateUserLoginService";

describe("Update user login", () => {
  it("should be able to update a user login", async () => {
    const userRepository = new FakeUserRepository();
    const service = new UpdateUserLoginService(userRepository);

    await userRepository.create({ login: "old-login", password: "12345678" });

    const user = await service.execute(0, "new-login");

    expect(user?.login).toBe("new-login");
  });

  it("should not update login for a user that does not exist", async () => {
    const userRepository = new FakeUserRepository();
    const service = new UpdateUserLoginService(userRepository);

    await expect(service.execute(0, "new-login")).rejects.toThrowError(
      NoExistError
    );
  });

  it("should not update login when another user already uses it", async () => {
    const userRepository = new FakeUserRepository();
    const service = new UpdateUserLoginService(userRepository);

    await userRepository.create({ login: "first", password: "12345678" });
    await userRepository.create({ login: "second", password: "12345678" });

    await expect(service.execute(0, "second")).rejects.toThrowError(
      AlreadyExistError
    );
  });
});
