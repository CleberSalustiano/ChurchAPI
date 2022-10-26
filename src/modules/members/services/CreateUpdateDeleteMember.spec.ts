import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import { IRequestCreateMemberDTO } from "../dtos/IRequestCreateMemberDTO";
import { IRequestUpdateMemberDTO } from "../dtos/IRequestUpdateMemberDTO";
import FakeMemberRepository from "../repositories/fakes/FakeMemberRepository";
import FakeUserRepository from "../repositories/fakes/FakeUserRepository";
import CreateNewMemberService from "./CreateNewMemberService";
import DeleteMemberService from "./DeleteMemberService";
import UpdateMemberService from "./UpdateMemberService";

describe("Test end-to-end for services", () => {
  it("should be able to create members, update and delete.", async () => {
    const memberRepository = new FakeMemberRepository();
    const churchRepository = new FakeChurchRepository();
    const userRepository = new FakeUserRepository();

    churchRepository.create({ date: "1999-12-12", id_location: 0 });

    const createNewMember = new CreateNewMemberService(
      memberRepository,
      userRepository,
      churchRepository
    );

    const updateMember = new UpdateMemberService(
      memberRepository,
      userRepository,
      churchRepository
    );

    const deleteMember = new DeleteMemberService(
      memberRepository,
      userRepository
    );

    const dataMember: IRequestCreateMemberDTO = {
      name: "Batata",
      birth_date: "1999-11-12",
      batism_date: "1999-12-12",
      titleChurch: "member",
      cpf: BigInt(12332112200),
      rg: 123123,
      email: "reidelas@email.com",
      id_church: 0,
      password: "123123",
    };

    await createNewMember.execute(dataMember);
    dataMember.cpf = BigInt(12332112210);
    await createNewMember.execute(dataMember);
    dataMember.cpf = BigInt(12332112211);
    const member = await createNewMember.execute(dataMember);

    expect(member).toBeTruthy();
    expect(member?.id).toBe(2);

    const dataMemberUpdate: IRequestUpdateMemberDTO = {
      name: "Batata",
      birth_date: "1999-11-12",
      batism_date: "1999-12-12",
      titleChurch: "manager",
      cpf: BigInt(12332112222),
      rg: 123123,
      email: "reidelas@email.com",
      password: "senha",
      id_church: 0,
      id_member: 1,
    };

    const memberUpdate = await updateMember.execute(dataMemberUpdate);

    expect(memberUpdate).toBeTruthy();
    expect(memberUpdate?.titleChurch).toBe("manager");

    const memberDeleted = await deleteMember.execute(0);

    expect(memberDeleted).toBeTruthy();
    expect(memberDeleted?.titleChurch).toBe("member");

    const members = await memberRepository.findAll();

    expect(members?.length).toBe(2);
  });
});
