import FakeChurchRepository from "../../churches/repositories/fakes/FakeChurchRepository";
import FakeManagerRepository from "../../manager/repositories/fakes/FakeManagerRepository";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeTreasurerRepository from "../../treasurer/repositories/fakes/FakeTreasurerRepository";
import ResolveSystemAccessService from "./ResolveSystemAccessService";

describe("Resolve system access", () => {
  it("should resolve editor access for active treasurers", async () => {
    const churchRepository = new FakeChurchRepository();
    const memberRepository = new FakeMemberRepository();
    const managerRepository = new FakeManagerRepository();
    const treasurerRepository = new FakeTreasurerRepository();
    await churchRepository.create({
      date: "2020-01-01",
      id_location: 1,
      type: "BRANCH",
      parent_church_id: null,
    });
    const service = new ResolveSystemAccessService(
      churchRepository,
      memberRepository,
      managerRepository,
      treasurerRepository
    );

    await memberRepository.create({
      id_church: 0,
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
    expect(access?.scope).toBe("CHURCH");
    expect(access?.permissions.canEditManagementData).toBe(true);
  });

  it("should resolve viewer access for active managers", async () => {
    const churchRepository = new FakeChurchRepository();
    const memberRepository = new FakeMemberRepository();
    const managerRepository = new FakeManagerRepository();
    const treasurerRepository = new FakeTreasurerRepository();
    await churchRepository.create({
      date: "2020-01-01",
      id_location: 1,
      type: "BRANCH",
      parent_church_id: null,
    });
    await churchRepository.create({
      date: "2020-01-02",
      id_location: 2,
      type: "BRANCH",
      parent_church_id: null,
    });
    const service = new ResolveSystemAccessService(
      churchRepository,
      memberRepository,
      managerRepository,
      treasurerRepository
    );

    await memberRepository.create({
      id_church: 0,
      batism_date: "2020-10-10",
      birth_date: "1990-01-10",
      cpf: BigInt(12345678901),
      email: "member@email.com",
      name: "Member Name",
      rg: 123123123,
      ecclesiasticalRole: "Member",
      id_user: 1,
    });

    await managerRepository.create({ id_member: 0, id_church: 1 });

    const access = await service.execute(1);

    expect(access?.level).toBe("VIEWER");
    expect(access?.scope).toBe("CHURCH");
    expect(access?.churchId).toBe(1);
    expect(access?.permissions.canViewManagementData).toBe(true);
    expect(access?.permissions.canEditManagementData).toBe(false);
  });

  it("should resolve member access when there is no active assignment", async () => {
    const churchRepository = new FakeChurchRepository();
    const memberRepository = new FakeMemberRepository();
    const managerRepository = new FakeManagerRepository();
    const treasurerRepository = new FakeTreasurerRepository();
    await churchRepository.create({
      date: "2020-01-01",
      id_location: 1,
      type: "BRANCH",
      parent_church_id: null,
    });
    const service = new ResolveSystemAccessService(
      churchRepository,
      memberRepository,
      managerRepository,
      treasurerRepository
    );

    await memberRepository.create({
      id_church: 0,
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
    expect(access?.scope).toBe("CHURCH");
    expect(access?.permissions.canViewManagementData).toBe(false);
  });

  it("should resolve global scope for headquarter assignments", async () => {
    const churchRepository = new FakeChurchRepository();
    const memberRepository = new FakeMemberRepository();
    const managerRepository = new FakeManagerRepository();
    const treasurerRepository = new FakeTreasurerRepository();
    await churchRepository.create({
      date: "2020-01-01",
      id_location: 1,
      type: "HEADQUARTER",
      parent_church_id: null,
    });
    const service = new ResolveSystemAccessService(
      churchRepository,
      memberRepository,
      managerRepository,
      treasurerRepository
    );

    await memberRepository.create({
      id_church: 0,
      batism_date: "2020-10-10",
      birth_date: "1990-01-10",
      cpf: BigInt(12345678901),
      email: "member@email.com",
      name: "Member Name",
      rg: 123123123,
      ecclesiasticalRole: "Member",
      id_user: 1,
    });

    await managerRepository.create({ id_member: 0, id_church: 0 });

    const access = await service.execute(1);

    expect(access?.scope).toBe("GLOBAL");
    expect(access?.level).toBe("EDITOR");
    expect(access?.permissions.canEditManagementData).toBe(true);
  });
});
