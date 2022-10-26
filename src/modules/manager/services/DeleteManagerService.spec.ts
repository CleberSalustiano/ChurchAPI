import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeManagerRepository from "../repositories/fakes/FakeManagerRepository";
import DeleteManagerService from "./DeleteManagerService";

describe("Delete a manager (desactive)", () => {
  it("should be able to desactive a manager", async () => {
    const churchRepository = new FakeChurchRepository();
    const memberRepository = new FakeMemberRepository();
    const managerRepository = new FakeManagerRepository();


    churchRepository.create({
      date:"1991-12-12",
      id_location: 1,
    });

    memberRepository.create({
      id_church: 0,
      batism_date:"1999-12-12",
      birth_date:"1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      titleChurch: "Member",
      id_user: 0
    });

    let manager = await managerRepository.create({id_church: 0, id_member: 0});

    const deleteManager = new DeleteManagerService(managerRepository);
    
    manager = await deleteManager.execute(0);

    expect(manager).toBeTruthy();
    expect(manager?.endDate).toBeTruthy();

  })
})