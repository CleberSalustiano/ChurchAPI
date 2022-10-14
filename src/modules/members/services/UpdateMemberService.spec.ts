import NoExistError from "../../../shared/errors/NoExistError";
import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import { IUpdateMemberDTO } from "../dtos/IUpdateMemberDTO";
import FakeMemberRepository from "../repositories/fakes/FakeMemberRepository";
import UpdateMemberService from "./UpdateMemberService";

describe("Update new Member", () => {
  it("should be able to update a member", async () => {
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeChurchRepository = new FakeChurchRepository();

    fakeChurchRepository.create({
      date: "1999-12-12",
      id_location: 0,
    });
    fakeMemberRepository.create({
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-10-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "email",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123456,
      titleChurch: "Member",
    });

    const updateNewMember = new UpdateMemberService(
      fakeMemberRepository,
      fakeChurchRepository
    );

    const dataMamber: IUpdateMemberDTO = {
      id_member: 0,
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "emailk",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Shepherd",
    };

    const member = await updateNewMember.execute(dataMamber);

    expect(member).toBeTruthy();
    expect(member?.rg).toBe(123123);
    expect(member?.titleChurch).toBe("Shepherd");
    expect(member?.login).toBe("emailk");
  });

  it("should not be able to update a member that doesn't exist", async () => {
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeChurchRepository = new FakeChurchRepository();

    fakeChurchRepository.create({
      date: "1999-12-12",
      id_location: 0,
    });
  
    const updateNewMember = new UpdateMemberService(
      fakeMemberRepository,
      fakeChurchRepository
    );

    const dataMamber: IUpdateMemberDTO = {
      id_member: 0,
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "emailk",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Shepherd",
    };

    expect(updateNewMember.execute(dataMamber)).rejects.toThrowError(NoExistError);
  })

  it("should not be able to update id_church in member, that id_church doesn't exist", async () => {
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeChurchRepository = new FakeChurchRepository();

    fakeMemberRepository.create({
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-10-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "email",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123456,
      titleChurch: "Member",
    });

    const updateNewMember = new UpdateMemberService(
      fakeMemberRepository,
      fakeChurchRepository
    );

    const dataMamber: IUpdateMemberDTO = {
      id_member: 0,
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "emailk",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Shepherd",
    };

    expect(updateNewMember.execute(dataMamber)).rejects.toThrowError(NoExistError);
  })

  it("should not be able to update member with birth_date/batism_date incorrect format", async () => {
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeChurchRepository = new FakeChurchRepository();

    fakeChurchRepository.create({
      date: "1999-12-12",
      id_location: 0,
    });
    fakeMemberRepository.create({
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-10-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "email",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123456,
      titleChurch: "Member",
    });

    const updateNewMember = new UpdateMemberService(
      fakeMemberRepository,
      fakeChurchRepository
    );

    const dataMamber: IUpdateMemberDTO = {
      id_member: 0,
      id_church: 0,
      batism_date: "1999-12-12",
      birth_date: "199911-12",
     cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "emailk",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Shepherd",
    };
    
    expect(updateNewMember.execute(dataMamber)).rejects.toThrowError(Error);
  })

  it("should not be able to update member with birh_date equals batism_date", async () => {
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeChurchRepository = new FakeChurchRepository();

    fakeChurchRepository.create({
      date:"1999-12-12",
      id_location: 0,
    });
    fakeMemberRepository.create({
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-10-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "email",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123456,
      titleChurch: "Member",
    });

    const updateNewMember = new UpdateMemberService(
      fakeMemberRepository,
      fakeChurchRepository
    );

    const dataMamber: IUpdateMemberDTO = {
      id_member: 0,
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "emailk",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Shepherd",
    };

    expect(updateNewMember.execute(dataMamber)).rejects.toThrowError(Error);
  })

  it("should be able to update member with a incorrect cpf",  async () => {
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeChurchRepository = new FakeChurchRepository();

    fakeChurchRepository.create({
      date: "1999-12-12",
      id_location: 0,
    });
    fakeMemberRepository.create({
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-10-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "email",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123456,
      titleChurch: "Member",
    });

    const updateNewMember = new UpdateMemberService(
      fakeMemberRepository,
      fakeChurchRepository
    );

    const dataMamber: IUpdateMemberDTO = {
      id_member: 0,
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-11-12",
      cpf: BigInt(1231232312),
      email: "email@email.com",
      login: "emailk",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Shepherd",
    };

    expect(updateNewMember.execute(dataMamber)).rejects.toThrowError(Error);
  })

  it("should be able to update member with CPF already registed", async () => {
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeChurchRepository = new FakeChurchRepository();

    fakeChurchRepository.create({
      date: "1999-12-12",
      id_location: 0,
    });
    fakeMemberRepository.create({
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-10-12",
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "email",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123456,
      titleChurch: "Member",
    });

    fakeMemberRepository.create({
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-10-12",
      cpf: BigInt(12312312313),
      email: "email@email.com",
      login: "email",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123456,
      titleChurch: "Member",
    });

    const updateNewMember = new UpdateMemberService(
      fakeMemberRepository,
      fakeChurchRepository
    );

    const dataMamber: IUpdateMemberDTO = {
      id_member: 0,
      id_church: 0,
      batism_date: "1999-11-12",
      birth_date: "1999-11-12",
      cpf: BigInt(12312312313),
      email: "email@email.com",
      login: "emailk",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Shepherd",
    };

    expect(updateNewMember.execute(dataMamber)).rejects.toThrowError(Error);
  })

});
