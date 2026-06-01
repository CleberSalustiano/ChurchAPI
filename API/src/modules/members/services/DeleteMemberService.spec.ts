import NoExistError from "../../../shared/errors/NoExistError";
import FakeChurchRepository from "../../churches/repositories/fakes/FakeChurchRepository";
import { ICreateMemberDTO } from "../dtos/ICreateMemberDTO";
import FakeManagerRepository from "../../manager/repositories/fakes/FakeManagerRepository";
import FakeMemberRepository from "../repositories/fakes/FakeMemberRepository";
import FakeUserRepository from "../repositories/fakes/FakeUserRepository";
import DeleteMemberService from "./DeleteMemberService";

describe("Delete a member", () => {
  it("should be able delete a member", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();
    const managerRepository = new FakeManagerRepository();
    churchRepository.create({ date: "1999-12-12", id_location: 0 });

      
    userRepository.create({ login: "teste", password: "1234" });
    userRepository.create({ login: "teste1", password: "12344" });

    const dataMamber: ICreateMemberDTO = {
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      ecclesiasticalRole: "Member",
      id_user: 0,
    };

    memberRepository.create(dataMamber);
    dataMamber.id_user = 1;
    dataMamber.name = "Aoba novo";
    memberRepository.create(dataMamber);

    const deleteMember = new DeleteMemberService(
      memberRepository,
      userRepository,
      managerRepository
    );

    const member = await deleteMember.execute(1);
    const deletedMember = await memberRepository.findById(1);
    const deletedUser = await userRepository.findById(1);

    expect(member).toBeTruthy();
    expect(member?.name).toBe("Aoba novo");
    expect(deletedMember).toBeUndefined();
    expect(deletedUser).toBeUndefined();
  });

  it("should not be able to delete a member that doesn't exist", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();
    const managerRepository = new FakeManagerRepository();

    churchRepository.create({ date: "1999-12-12", id_location: 0 });
    userRepository.create({login: "teste", password: "1234"})

    const dataMamber: ICreateMemberDTO = {
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      ecclesiasticalRole: "Member",
      id_user: 0
    };

    memberRepository.create(dataMamber);

    const deleteMember = new DeleteMemberService(
      memberRepository,
      userRepository,
      managerRepository
    );

    expect(deleteMember.execute(1)).rejects.toBeInstanceOf(NoExistError);
  });

  it("should not be able to delete the only active manager member of a church", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();
    const managerRepository = new FakeManagerRepository();

    await churchRepository.create({ date: "1999-12-12", id_location: 0 });
    await userRepository.create({ login: "dirigente", password: "1234" });

    const memberData: ICreateMemberDTO = {
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Dirigente",
      rg: 123123,
      ecclesiasticalRole: "Member",
      id_user: 0,
    };

    await memberRepository.create(memberData);
    await managerRepository.create({ id_church: 0, id_member: 0 });

    const deleteMember = new DeleteMemberService(
      memberRepository,
      userRepository,
      managerRepository
    );

    await expect(deleteMember.execute(0)).rejects.toThrowError(Error);
  });
});
