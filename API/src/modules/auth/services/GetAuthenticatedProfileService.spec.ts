import { hashPassword } from "../../../shared/security/password";
import NoExistError from "../../../shared/errors/NoExistError";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeUserRepository from "../../members/repositories/fakes/FakeUserRepository";
import GetAuthenticatedProfileService from "./GetAuthenticatedProfileService";

describe("Get authenticated profile", () => {
  it("should return the authenticated user profile", async () => {
    const userRepository = new FakeUserRepository();
    const memberRepository = new FakeMemberRepository();
    const service = new GetAuthenticatedProfileService(
      userRepository,
      memberRepository
    );

    const user = await userRepository.create({
      login: "member-login",
      password: await hashPassword("Senha123"),
    });

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

    const profile = await service.execute(user!.id);

    expect(profile.user.login).toBe("member-login");
    expect(profile.member.cpf).toBe("12345678901");
    expect(profile.mustChangePassword).toBe(false);
  });

  it("should fail when user does not exist", async () => {
    const userRepository = new FakeUserRepository();
    const memberRepository = new FakeMemberRepository();
    const service = new GetAuthenticatedProfileService(
      userRepository,
      memberRepository
    );

    await expect(service.execute(1)).rejects.toThrowError(NoExistError);
  });

  it("should flag the profile when the user still has a temporary password", async () => {
    const userRepository = new FakeUserRepository();
    const memberRepository = new FakeMemberRepository();
    const service = new GetAuthenticatedProfileService(
      userRepository,
      memberRepository
    );

    const user = await userRepository.create({
      login: "member-login",
      password: await hashPassword("1234", { skipPolicy: true }),
    });

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

    const profile = await service.execute(user!.id);

    expect(profile.mustChangePassword).toBe(true);
  });
});
