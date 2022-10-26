import NoExistError from "../../../shared/errors/NoExistError";
import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import { IRequestCreateMemberDTO } from "../dtos/IRequestCreateMemberDTO";
import FakeMemberRepository from "../repositories/fakes/FakeMemberRepository";
import FakeUserRepository from "../repositories/fakes/FakeUserRepository";
import CreateNewMemberService from "./CreateNewMemberService";

describe("Create New Member", () => {
  it("should be possible to create a new member", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();

    churchRepository.create({ date: "1999-12-12", id_location: 0 });

    const createNewMember = new CreateNewMemberService(
      memberRepository,
      userRepository,
      churchRepository
    );

    const dataMamber: IRequestCreateMemberDTO = {
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Member",
    };

    const member = await createNewMember.execute(dataMamber);

    expect(member).toBeTruthy();
    expect(member?.rg).toBe(123123);
  });

  it("should not be able to create a new member with a church that doesn't exist", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();

    churchRepository.create({ date: "1999-12-12", id_location: 0 });

    const createNewMember = new CreateNewMemberService(
      memberRepository,
      userRepository,
      churchRepository
    );

    const dataMamber: IRequestCreateMemberDTO = {
      id_church: 1,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Member",
    };

    expect(createNewMember.execute(dataMamber)).rejects.toThrowError(
      NoExistError
    );
  });

  it("should not be able to create a new Member with a cpf with incorrect format", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();

    churchRepository.create({ date: "1999-12-12", id_location: 0 });

    const createNewMember = new CreateNewMemberService(
      memberRepository,
      userRepository,
      churchRepository
    );

    const dataMamber: IRequestCreateMemberDTO = {
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(1231232312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Member",
    };

    expect(createNewMember.execute(dataMamber)).rejects.toThrowError(Error);
  });

  it("should not be able to create a new Member where his birth date is equals with his batism date", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();

    churchRepository.create({ date: "1999-12-12", id_location: 0 });

    const createNewMember = new CreateNewMemberService(
      memberRepository,
      userRepository,
      churchRepository
    );

    const dataMamber: IRequestCreateMemberDTO = {
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-12-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Member",
    };

    expect(createNewMember.execute(dataMamber)).rejects.toThrowError(Error);
  });

  it("should not be able to create two equal CPF", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();

    churchRepository.create({ date: "1999-12-12", id_location: 0 });
    userRepository.create({password: "6868"});
    memberRepository.create({
      id_church: 0,
      birth_date: "1999-11-12",
      batism_date: "1999-12-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      titleChurch: "Member",
      id_user: 0
    });
    const createNewMember = new CreateNewMemberService(
      memberRepository,
      userRepository,
      churchRepository
    );

    const dataMamber: IRequestCreateMemberDTO = {
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Member",
    };

    expect(createNewMember.execute(dataMamber)).rejects.toThrowError(Error);
  });
});
