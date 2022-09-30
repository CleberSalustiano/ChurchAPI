import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import { ICreateMemberDTO } from "../dtos/ICreateMemberDTO";
import { IUpdateMemberDTO } from "../dtos/IUpdateMemberDTO";
import FakeMemberRepository from "../repositories/fakes/FakeMemberRepository";
import CreateNewMemberService from "./CreateNewMemberService";
import DeleteMemberService from "./DeleteMemberService";
import UpdateMemberService from "./UpdateMemberService";

describe("Test end-to-end for services",  () => {
  it("should be able to create members, update and delete.", async() => {
    const fakeMemberRepository = new FakeMemberRepository();
    const fakeChurchRepository = new FakeChurchRepository();

    fakeChurchRepository.create({ date: new Date("1999-12-12"), id_location: 0 });

    const createNewMember = new CreateNewMemberService(
      fakeMemberRepository,
      fakeChurchRepository
    );

    const updateMember = new UpdateMemberService(
      fakeMemberRepository,
      fakeChurchRepository
    );

    const deleteMember = new DeleteMemberService(fakeMemberRepository);
    
    const dataMember : ICreateMemberDTO = {
      name: "Batata",
      birth_date: new Date("1999-11-12"),
      batism_date: new Date("1999-12-12"),
      titleChurch: "member",
      cpf: BigInt(12332112200),
      rg: 123123,
      login: "caldo",
      email: "reidelas@email.com",
      password: "senha",
      id_church: 0
    }

    await createNewMember.execute(dataMember) 
    dataMember.cpf = BigInt(12332112210)
    await createNewMember.execute(dataMember) 
    dataMember.cpf = BigInt(12332112211)
    const member = await createNewMember.execute(dataMember) 

    expect(member).toBeTruthy();
    expect(member?.id).toBe(2);

    const dataMemberUpdate : IUpdateMemberDTO = {
      name: "Batata",
      birth_date: new Date("1999-11-12"),
      batism_date: new Date("1999-12-12"),
      titleChurch: "manager",
      cpf: BigInt(12332112222),
      rg: 123123,
      login: "caldo",
      email: "reidelas@email.com",
      password: "senha",
      id_church: 0,
      id_member: 1
    }

    const memberUpdate = await updateMember.execute(dataMemberUpdate)

    expect(memberUpdate).toBeTruthy();
    expect(memberUpdate?.titleChurch).toBe("manager");

    const memberDeleted = await deleteMember.execute(0);

    expect(memberDeleted).toBeTruthy();
    expect(memberDeleted?.titleChurch).toBe("manager");
    
    const members = await fakeMemberRepository.findAll();

    expect(members?.length).toBe(2);

  });
});
