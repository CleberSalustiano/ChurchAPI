import NoExistError from "../../../shared/errors/NoExistError";
import {
  MEMBER_DEFAULT_PASSWORD,
  verifyPassword,
} from "../../../shared/security/password";
import FakeChurchRepository from "../../churches/repositories/fakes/FakeChurchRepository";
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
      rg: 123123,
      login: "teste",
      ecclesiasticalRole: "Member",
    };

    const member = await createNewMember.execute(dataMamber);
    const user = await userRepository.findByLogin("teste");

    expect(member).toBeTruthy();
    expect(member?.rg).toBe(123123);
    expect(user?.password).not.toBe("12312312312");
    await expect(verifyPassword("12312312312", user!.password)).resolves.toBe(
      true
    );
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
      rg: 123123,
      login: "teste",
      ecclesiasticalRole: "Member",
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
      rg: 123123,
      login: "teste",
      ecclesiasticalRole: "Member",
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
      rg: 123123,
      login: "teste",
      ecclesiasticalRole: "Member",
    };

    expect(createNewMember.execute(dataMamber)).rejects.toThrowError(Error);
  });

  it("should not be able to create two equal CPF", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();

    churchRepository.create({ date: "1999-12-12", id_location: 0 });
    userRepository.create({login: "teste",password: "68686868"});
    memberRepository.create({
      id_church: 0,
      birth_date: "1999-11-12",
      batism_date: "1999-12-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123123,
      ecclesiasticalRole: "Member",
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
      rg: 123123,
      login: "teste",
      ecclesiasticalRole: "Member",
    };

    expect(createNewMember.execute(dataMamber)).rejects.toThrowError(Error);
  });

  it("should allow 1234 as an explicit temporary initial password", async () => {
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
      cpf: BigInt(12312312313),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      password: MEMBER_DEFAULT_PASSWORD,
      rg: 123123,
      login: "teste-min-password",
      ecclesiasticalRole: "Member",
    };

    await createNewMember.execute(dataMamber);

    const user = await userRepository.findByLogin("teste-min-password");

    await expect(
      verifyPassword(MEMBER_DEFAULT_PASSWORD, user!.password)
    ).resolves.toBe(true);
  });

  it("should reject a custom initial password outside the allowed temporary options", async () => {
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
      cpf: BigInt(12312312313),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      password: "SenhaInicial123",
      rg: 123123,
      login: "teste-invalid-initial-password",
      ecclesiasticalRole: "Member",
    };

    await expect(createNewMember.execute(dataMamber)).rejects.toThrowError(
      "Initial member password must be the member CPF or 1234"
    );
  });
});
