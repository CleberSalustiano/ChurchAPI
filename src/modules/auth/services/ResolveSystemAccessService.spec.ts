import FakeManagerRepository from "../../manager/repositories/fakes/FakeManagerRepository";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeTreasurerRepository from "../../treasurer/repositories/fakes/FakeTreasurerRepository";
import ResolveSystemAccessService from "./ResolveSystemAccessService";

describe("Resolve system access", () => {
  it("should resolve editor access for active treasurers", async () => {
    const memberRepository = new FakeMemberRepository();
    const managerRepository = new FakeManagerRepository();
    const treasurerRepository = new FakeTreasurerRepository();
    const service = new ResolveSystemAccessService(
      memberRepository,
      managerRepository,
      treasurerRepository
    );

    await memberRepository.create({
      id_church: 10,
      batism_date: "2020-10-10",
      birth_date: "1990-01-10",
      cpf: BigInt(12345678901),
      email: "member@email.com",
      name: "Member Name",
      rg: 123123123,
      ecclesiasticalRole: "Member",
      id_user: 1,
    });

    await treasurerRepository.create(0);

    const access = await service.execute(1);

    expect(access?.level).toBe("EDITOR");
    expect(access?.permissions.canEditManagementData).toBe(true);
  });

  it("should resolve viewer access for active managers", async () => {
    const memberRepository = new FakeMemberRepository();
    const managerRepository = new FakeManagerRepository();
    const treasurerRepository = new FakeTreasurerRepository();
    const service = new ResolveSystemAccessService(
      memberRepository,
      managerRepository,
      treasurerRepository
    );

    await memberRepository.create({
      id_church: 7,
      batism_date: "2020-10-10",
      birth_date: "1990-01-10",
      cpf: BigInt(12345678901),
      email: "member@email.com",
      name: "Member Name",
      rg: 123123123,
      ecclesiasticalRole: "Member",
      id_user: 1,
    });

    await managerRepository.create({ id_member: 0, id_church: 99 });

    const access = await service.execute(1);

    expect(access?.level).toBe("VIEWER");
    expect(access?.churchId).toBe(99);
    expect(access?.permissions.canViewManagementData).toBe(true);
    expect(access?.permissions.canEditManagementData).toBe(false);
  });

  it("should resolve member access when there is no active assignment", async () => {
    const memberRepository = new FakeMemberRepository();
    const managerRepository = new FakeManagerRepository();
    const treasurerRepository = new FakeTreasurerRepository();
    const service = new ResolveSystemAccessService(
      memberRepository,
      managerRepository,
      treasurerRepository
    );

    await memberRepository.create({
      id_church: 7,
      batism_date: "2020-10-10",
      birth_date: "1990-01-10",
      cpf: BigInt(12345678901),
      email: "member@email.com",
      name: "Member Name",
      rg: 123123123,
      ecclesiasticalRole: "Member",
      id_user: 1,
    });

    const access = await service.execute(1);

    expect(access?.level).toBe("MEMBER");
    expect(access?.permissions.canViewManagementData).toBe(false);
  });
});
