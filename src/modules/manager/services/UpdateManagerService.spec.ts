import NoExistError from "../../../shared/errors/NoExistError";
import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeManagerRepository from "../repositories/fakes/FakeManagerRepository";
import UpdateManagerService from "./UpdateManagerService";

describe("Update a manager", () => {
  it("should be able to update a manager",async  () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const managerRepository = new FakeManagerRepository();

    const updateManager = new UpdateManagerService(
      memberRepository,
      churchRepository,
      managerRepository
    );

    churchRepository.create({ date: "1999-12-12", id_location: 2 });
    churchRepository.create({ date: "1999-12-12", id_location: 1 });
    memberRepository.create({
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      titleChurch: "Member",
      id_user: 0
    });

    memberRepository.create({
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      titleChurch: "Member",
      id_user: 0
    });
    managerRepository.create({id_church: 0, id_member: 0})

    const manager = await updateManager.execute({id_church: 1, id_manager: 0, id_member: 1});

    expect(manager).toBeTruthy();
    expect(manager.id_church).toBe(1);
    expect(manager.id_member).toBe(1);
  });

  it("should not be able to update a manager with member doesn't exist",async  () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const managerRepository = new FakeManagerRepository();

    const updateManager = new UpdateManagerService(
      memberRepository,
      churchRepository,
      managerRepository
    );

    churchRepository.create({ date: "1999-12-12", id_location: 2 });
    churchRepository.create({ date: "1999-12-12", id_location: 1 });
    memberRepository.create({
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      titleChurch: "Member",
      id_user: 0
    });
    managerRepository.create({id_church: 0, id_member: 0})

    expect(updateManager.execute({id_church: 1, id_manager: 0, id_member: 1})).rejects.toThrowError(NoExistError);
  })

  it("should not be able to update a manager with church doesn't exist",async  () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const managerRepository = new FakeManagerRepository();

    const updateManager = new UpdateManagerService(
      memberRepository,
      churchRepository,
      managerRepository
    );

    churchRepository.create({ date: "1999-12-12", id_location: 2 });
    memberRepository.create({
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      titleChurch: "Member",
      id_user: 0
    });

    memberRepository.create({
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      titleChurch: "Member",
      id_user: 0
    });
    managerRepository.create({id_church: 0, id_member: 0})

    expect(updateManager.execute({id_church: 1, id_manager: 0, id_member: 1})).rejects.toThrowError(NoExistError);
  })

  it("should not be able to update a manager that doesn't exist", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const managerRepository = new FakeManagerRepository();

    const updateManager = new UpdateManagerService(
      memberRepository,
      churchRepository,
      managerRepository
    );

    churchRepository.create({ date: "1999-12-12", id_location: 2 });
    churchRepository.create({ date: "1999-12-12", id_location: 1 });
    memberRepository.create({
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      titleChurch: "Member",
      id_user: 0
    });

    memberRepository.create({
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      titleChurch: "Member",
      id_user: 0
    });

    expect(updateManager.execute({id_church: 1, id_manager: 0, id_member: 1})).rejects.toThrowError(NoExistError);
  })
});
