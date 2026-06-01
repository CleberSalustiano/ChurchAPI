import FakeChurchRepository from "../../churches/repositories/fakes/FakeChurchRepository";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeManagerRepository from "../repositories/fakes/FakeManagerRepository";
import DeleteManagerService from "./DeleteManagerService";

describe("Delete a manager (desactive)", () => {
  it("should be able to desactive a manager", async () => {
    const memberRepository = new FakeMemberRepository();
    const managerRepository = new FakeManagerRepository();

    const churchRepository = new FakeChurchRepository();
    churchRepository.create({
      date: "1991-12-12",
      id_location: 1,
    });

    memberRepository.create({
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      ecclesiasticalRole: "Member",
      id_user: 0
    });

    memberRepository.create({
      id_church: 0,
      batism_date: "1999-12-13",
      birth_date: "1999-11-13",
      cpf: BigInt(12312312313),
      email: "email2@email.com",
      name: "Novo Dirigente",
      rg: 123124,
      ecclesiasticalRole: "Member",
      id_user: 1,
    });

    await managerRepository.create({ id_church: 0, id_member: 0 });
    let manager = await managerRepository.create({ id_church: 0, id_member: 1 });

    const deleteManager = new DeleteManagerService(managerRepository);
    
    manager = await deleteManager.execute(0);

    expect(manager).toBeTruthy();
    expect(manager?.endDate).toBeTruthy();
  });

  it("should not be able to desactive the only active manager of a church", async () => {
    const managerRepository = new FakeManagerRepository();

    await managerRepository.create({ id_church: 0, id_member: 0 });

    const deleteManager = new DeleteManagerService(managerRepository);

    await expect(deleteManager.execute(0)).rejects.toThrowError(Error);
  });
});
