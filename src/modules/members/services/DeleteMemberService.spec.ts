import NoExistError from "../../../shared/errors/NoExistError";
import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import { ICreateMemberDTO } from "../dtos/ICreateMemberDTO";
import FakeMemberRepository from "../repositories/fakes/FakeMemberRepository";
import DeleteMemberService from "./DeleteMemberService";

describe("Delete a member", () => {
  it("should be able delete a member", async () => {
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeChurchRepository = new FakeChurchRepository();

    fakeChurchRepository.create({ date: new Date("1999-12-12"), id_location: 0 });

    const dataMamber: ICreateMemberDTO = {
      id_church: 0,
      batism_date: new Date("1999-12-12"),
      birth_date: new Date("1999-11-12"),
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "email",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Member"
    };

    fakeMemberRepository.create(dataMamber);
    dataMamber.login = "aoba"
    fakeMemberRepository.create(dataMamber);

    const deleteMember = new DeleteMemberService(fakeMemberRepository);
    
    const member = await deleteMember.execute(1);

    expect(member).toBeTruthy();
    expect(member?.password).toBe("6969");
    expect(member?.login).toBe("aoba");
  })

  it("should not be able to delete a member that doesn't exist", async () => {
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeChurchRepository = new FakeChurchRepository();

    fakeChurchRepository.create({ date: new Date("1999-12-12"), id_location: 0 });

    const dataMamber: ICreateMemberDTO = {
      id_church: 0,
      batism_date: new Date("1999-12-12"),
      birth_date: new Date("1999-11-12"),
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "email",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Member"
    };

    fakeMemberRepository.create(dataMamber);

    const deleteMember = new DeleteMemberService(fakeMemberRepository);
    
    expect(deleteMember.execute(1)).rejects.toBeInstanceOf(NoExistError);
  })
})