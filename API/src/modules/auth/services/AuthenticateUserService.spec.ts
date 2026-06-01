import AppError from "../../../shared/errors/AppError";
import { hashPassword } from "../../../shared/security/password";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeUserRepository from "../../members/repositories/fakes/FakeUserRepository";
import AuthenticateUserService from "./AuthenticateUserService";

describe("Authenticate user", () => {
  it("should be able to authenticate with valid credentials", async () => {
    const userRepository = new FakeUserRepository();
    const memberRepository = new FakeMemberRepository();
    const service = new AuthenticateUserService(userRepository, memberRepository);

    const password = await hashPassword("12345678");
    const user = await userRepository.create({ login: "member-login", password });

    await memberRepository.create({
      id_church: 1,
      batism_date: "2020-10-10",
      birth_date: "1990-01-10",
      cpf: BigInt(12345678901),
      email: "member@email.com",
      name: "Member Name",
      rg: 123123123,
      ecclesiasticalRole: "Member",
      id_user: user!.id,
    });

    const response = await service.execute("member-login", "12345678");

    expect(response.token).toBeTruthy();
    expect(response.user.login).toBe("member-login");
    expect(response.member.name).toBe("Member Name");
  });

  it("should not authenticate with an invalid password", async () => {
    const userRepository = new FakeUserRepository();
    const memberRepository = new FakeMemberRepository();
    const service = new AuthenticateUserService(userRepository, memberRepository);

    const password = await hashPassword("12345678");
    await userRepository.create({ login: "member-login", password });

    await expect(
      service.execute("member-login", "wrong-password")
    ).rejects.toThrowError(AppError);
  });

  it("should not authenticate when the login does not exist", async () => {
    const userRepository = new FakeUserRepository();
    const memberRepository = new FakeMemberRepository();
    const service = new AuthenticateUserService(userRepository, memberRepository);

    await expect(
      service.execute("missing-login", "12345678")
    ).rejects.toThrowError(AppError);
  });

  it("should not authenticate when the member church is inactive", async () => {
    const userRepository = new FakeUserRepository();
    const memberRepository = new FakeMemberRepository();
    const service = new AuthenticateUserService(userRepository, memberRepository);

    const password = await hashPassword("12345678");
    const user = await userRepository.create({ login: "member-login", password });

    await memberRepository.create({
      id_church: 1,
      batism_date: "2020-10-10",
      birth_date: "1990-01-10",
      cpf: BigInt(12345678901),
      email: "member@email.com",
      name: "Member Name",
      rg: 123123123,
      ecclesiasticalRole: "Member",
      id_user: user!.id,
    });

    const member = await memberRepository.findByUserId(user!.id);

    if (member) {
      member.church = {
        id: 1,
        creationDate: new Date("2020-01-01"),
        type: "BRANCH",
        status: "INACTIVE",
        id_location: 1,
      };
    }

    await expect(
      service.execute("member-login", "12345678")
    ).rejects.toThrowError("This church is not active");
  });
});
