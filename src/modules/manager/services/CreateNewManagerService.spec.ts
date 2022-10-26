import AlreadyExistError from "../../../shared/errors/AlreadyExistError";
import NoExistError from "../../../shared/errors/NoExistError";
import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeManagerRepository from "../repositories/fakes/FakeManagerRepository";
import CreateNewManagerService from "./CreateNewManageService";

describe("Create a new manager for a church", () => {
  it("should be create a new manager for a church", async () => {
    const fakeChurchRepository = new FakeChurchRepository();
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeManagerRepository = new FakeManagerRepository();

    const createNewManager = new CreateNewManagerService(
      fakeMemberRepository,
      fakeChurchRepository,
      fakeManagerRepository
    );

    fakeChurchRepository.create({
      date:"1991-12-12",
      id_location: 1,
    });

    fakeMemberRepository.create({
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      titleChurch: "Member", id_user: 0
    });

    const manager = await createNewManager.execute({
      id_church: 0,
      id_member: 0,
    });

    expect(manager).toBeTruthy();
    expect(manager?.id_church).toBe(0);
  });

  it("should not be able to create a manager with a nonexistent member", async () => {
    const fakeChurchRepository = new FakeChurchRepository();
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeManagerRepository = new FakeManagerRepository();

    const createNewManager = new CreateNewManagerService(
      fakeMemberRepository,
      fakeChurchRepository,
      fakeManagerRepository
    );

    fakeChurchRepository.create({
      date: "1991-12-12",
      id_location: 1,
    });

    expect(
      createNewManager.execute({ id_church: 0, id_member: 0 })
    ).rejects.toThrowError(NoExistError);
  });

  it("should not be able to create a manager with a nonexistent church", async () => {
    const fakeChurchRepository = new FakeChurchRepository();
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeManagerRepository = new FakeManagerRepository();

    const createNewManager = new CreateNewManagerService(
      fakeMemberRepository,
      fakeChurchRepository,
      fakeManagerRepository
    );

    fakeMemberRepository.create({
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      titleChurch: "Member", id_user: 0
    });

    expect(
      createNewManager.execute({ id_church: 0, id_member: 0 })
    ).rejects.toThrowError(NoExistError);
  });

  it("should not be able to create more than three managers", async () => {
    const fakeChurchRepository = new FakeChurchRepository();
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeManagerRepository = new FakeManagerRepository();

    const createNewManager = new CreateNewManagerService(
      fakeMemberRepository,
      fakeChurchRepository,
      fakeManagerRepository
    );

    fakeChurchRepository.create({
      date: "1991-12-12",
      id_location: 1,
    });

    fakeMemberRepository.create({
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      titleChurch: "Member", id_user: 0
    });

    fakeMemberRepository.create({
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      titleChurch: "Member", id_user: 0
    });

    fakeMemberRepository.create({
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      titleChurch: "Member", id_user: 0
    });

    fakeMemberRepository.create({
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      titleChurch: "Member", id_user: 0
    });

    await createNewManager.execute({
      id_church: 0,
      id_member: 0,
    });

    await createNewManager.execute({id_church: 0, id_member: 1})
    await createNewManager.execute({id_church: 0, id_member: 2})

    expect(createNewManager.execute({id_church: 0, id_member: 3})).rejects.toThrowError(Error);
  })

  it("should not be able to create two managers using the same member", async () => {
    const fakeChurchRepository = new FakeChurchRepository();
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeManagerRepository = new FakeManagerRepository();

    const createNewManager = new CreateNewManagerService(
      fakeMemberRepository,
      fakeChurchRepository,
      fakeManagerRepository
    );

    fakeChurchRepository.create({
      date: "1991-12-12",
      id_location: 1,
    });

    fakeMemberRepository.create({
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      titleChurch: "Member", id_user: 0
    });

    const manager = await createNewManager.execute({
      id_church: 0,
      id_member: 0,
    });

    expect(createNewManager.execute({
      id_church: 0,
      id_member: 0,
    })).rejects.toThrowError(AlreadyExistError)
  })
});
