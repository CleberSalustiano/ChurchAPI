import NoExistError from "../../../shared/errors/NoExistError";
import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import { ICreateMemberDTO } from "../dtos/ICreateMemberDTO";
import FakeMemberRepository from "../repositories/fakes/FakeMemberRepository";
import CreateNewMemberService from "./CreateNewMemberService";

describe("Create New Member", () => {
  it("should be possible to create a new member", async () => {
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeChurchRepository = new FakeChurchRepository();

    fakeChurchRepository.create({ date: "1999-12-12", id_location: 0 });

    const createNewMember = new CreateNewMemberService(
      fakeMemberRepository,
      fakeChurchRepository
    );

    const dataMamber: ICreateMemberDTO = {
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "email",
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
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeChurchRepository = new FakeChurchRepository();

    fakeChurchRepository.create({ date: "1999-12-12", id_location: 0 });

    const createNewMember = new CreateNewMemberService(
      fakeMemberRepository,
      fakeChurchRepository
    );

    const dataMamber: ICreateMemberDTO = {
      id_church: 1,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "email",
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
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeChurchRepository = new FakeChurchRepository();

    fakeChurchRepository.create({ date: "1999-12-12", id_location: 0 });

    const createNewMember = new CreateNewMemberService(
      fakeMemberRepository,
      fakeChurchRepository
    );

    const dataMamber: ICreateMemberDTO = {
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(1231232312),
      email: "email@email.com",
      login: "email",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Member",
    };

    expect(createNewMember.execute(dataMamber)).rejects.toThrowError(Error);
  });

  it("should not be able to create a new Member where his birth date is equals with his batism date", async () => {
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeChurchRepository = new FakeChurchRepository();

    fakeChurchRepository.create({ date: "1999-12-12", id_location: 0 });

    const createNewMember = new CreateNewMemberService(
      fakeMemberRepository,
      fakeChurchRepository
    );

    const dataMamber: ICreateMemberDTO = {
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-12-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "email",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Member",
    };

    expect(createNewMember.execute(dataMamber)).rejects.toThrowError(Error);
  });

  it("should not be able to create two equal CPF", async () => {
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeChurchRepository = new FakeChurchRepository();

    fakeChurchRepository.create({ date: "1999-12-12", id_location: 0 });
    fakeMemberRepository.create({
      id_church: 0,
      birth_date: "1999-11-12",
      batism_date: "1999-12-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "email",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Member",
    });
    const createNewMember = new CreateNewMemberService(
      fakeMemberRepository,
      fakeChurchRepository
    );

    const dataMamber: ICreateMemberDTO = {
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "email",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Member",
    };

    expect(createNewMember.execute(dataMamber)).rejects.toThrowError(Error);
  });
});
