import NoExistError from "../../../shared/errors/NoExistError";
import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import { IRequestUpdateMemberDTO } from "../dtos/IRequestUpdateMemberDTO";
import FakeMemberRepository from "../repositories/fakes/FakeMemberRepository";
import FakeUserRepository from "../repositories/fakes/FakeUserRepository";
import UpdateMemberService from "./UpdateMemberService";

describe("Update new Member", () => {
  it("should be able to update a member", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();

    churchRepository.create({
      date: "1999-12-12",
      id_location: 0,
    });
    userRepository.create({ password: "123" });
    memberRepository.create({
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-10-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123456,
      titleChurch: "Member",
      id_user: 0,
    });

    const updateNewMember = new UpdateMemberService(
      memberRepository,
      userRepository,
      churchRepository
    );

    const dataMamber: IRequestUpdateMemberDTO = {
      id_member: 0,
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Shepherd",
    };

    const member = await updateNewMember.execute(dataMamber);

    expect(member).toBeTruthy();
    expect(member?.rg).toBe(123123);
    expect(member?.titleChurch).toBe("Shepherd");
  });

  it("should not be able to update a member that doesn't exist", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();

    churchRepository.create({
      date: "1999-12-12",
      id_location: 0,
    });

    const updateNewMember = new UpdateMemberService(
      memberRepository,
      userRepository,
      churchRepository
    );

    const dataMamber: IRequestUpdateMemberDTO = {
      id_member: 0,
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Shepherd",
    };

    expect(updateNewMember.execute(dataMamber)).rejects.toThrowError(
      NoExistError
    );
  });

  it("should not be able to update id_church in member, that id_church doesn't exist", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();

    userRepository.create({ password: "123" });

    memberRepository.create({
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-10-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123456,
      titleChurch: "Member",
      id_user: 0,
    });

    const updateNewMember = new UpdateMemberService(
      memberRepository,
      userRepository,
      churchRepository
    );

    const dataMamber: IRequestUpdateMemberDTO = {
      id_member: 0,
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Shepherd",
    };

    expect(updateNewMember.execute(dataMamber)).rejects.toThrowError(
      NoExistError
    );
  });

  it("should not be able to update member with birth_date/batism_date incorrect format", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();

    userRepository.create({ password: "1234" });
    churchRepository.create({
      date: "1999-12-12",
      id_location: 0,
    });
    memberRepository.create({
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-10-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123456,
      titleChurch: "Member",
      id_user: 0,
    });

    const updateNewMember = new UpdateMemberService(
      memberRepository,
      userRepository,
      churchRepository
    );

    const dataMamber: IRequestUpdateMemberDTO = {
      id_member: 0,
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "199911-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Shepherd",
    };

    expect(updateNewMember.execute(dataMamber)).rejects.toThrowError(Error);
  });

  it("should not be able to update member with birh_date equals batism_date", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();

    userRepository.create({ password: "90" });
    churchRepository.create({
      date: "1999-12-12",
      id_location: 0,
    });
    memberRepository.create({
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-10-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123456,
      titleChurch: "Member",
      id_user: 0,
    });

    const updateNewMember = new UpdateMemberService(
      memberRepository,
      userRepository,
      churchRepository
    );

    const dataMamber: IRequestUpdateMemberDTO = {
      id_member: 0,
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Shepherd",
    };

    expect(updateNewMember.execute(dataMamber)).rejects.toThrowError(Error);
  });

  it("should be able to update member with a incorrect cpf", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();

    userRepository.create({ password: "123" });
    churchRepository.create({
      date: "1999-12-12",
      id_location: 0,
    });
    memberRepository.create({
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-10-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123456,
      titleChurch: "Member",
      id_user: 0,
    });

    const updateNewMember = new UpdateMemberService(
      memberRepository,
      userRepository,
      churchRepository
    );

    const dataMamber: IRequestUpdateMemberDTO = {
      id_member: 0,
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-11-12",
      cpf: BigInt(1231232312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Shepherd",
    };

    expect(updateNewMember.execute(dataMamber)).rejects.toThrowError(Error);
  });

  it("should be able to update member with CPF already registed", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();

    userRepository.create({ password: "12310" });
    churchRepository.create({
      date: "1999-12-12",
      id_location: 0,
    });
    memberRepository.create({
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-10-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123456,
      titleChurch: "Member",
      id_user: 0,
    });

    userRepository.create({ password: "12310" });
    memberRepository.create({
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-10-12",
      cpf: BigInt(12312312313),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      rg: 123456,
      titleChurch: "Member",
      id_user: 1
    });

    const updateNewMember = new UpdateMemberService(
      memberRepository,
      userRepository,
      churchRepository
    );

    const dataMamber: IRequestUpdateMemberDTO = {
      id_member: 0,
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312313),
      email: "email@email.com",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Shepherd",
    };

    expect(updateNewMember.execute(dataMamber)).rejects.toThrowError(Error);
  });
});
