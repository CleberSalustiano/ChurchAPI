import NoExistError from "../../../shared/errors/NoExistError";
import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import { ICreateMemberDTO } from "../dtos/ICreateMemberDTO";
import FakeMemberRepository from "../repositories/fakes/FakeMemberRepository";
import FakeUserRepository from "../repositories/fakes/FakeUserRepository";
import DeleteMemberService from "./DeleteMemberService";

describe("Delete a member", () => {
  it("should be able delete a member", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();
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
      titleChurch: "Member",
      id_user: 0,
    };

    memberRepository.create(dataMamber);
    dataMamber.id_user = 1;
    dataMamber.name = "Aoba novo";
    memberRepository.create(dataMamber);

    const deleteMember = new DeleteMemberService(
      memberRepository,
      userRepository
    );

    const member = await deleteMember.execute(1);

    expect(member).toBeTruthy();
    expect(member?.name).toBe("Aoba novo");
  });

  it("should not be able to delete a member that doesn't exist", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();

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
      titleChurch: "Member",
      id_user: 0
    };

    memberRepository.create(dataMamber);

    const deleteMember = new DeleteMemberService(memberRepository, userRepository);

    expect(deleteMember.execute(1)).rejects.toBeInstanceOf(NoExistError);
  });
});
