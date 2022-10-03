import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeTreasurerRepository from "../repositories/fakes/FakeTreasurerRepository";
import CreateNewTreasurerService from "./CreateNewTreasureService";

describe("Create new treasurer", () => {
  it("should be able to create a new treasurer", async () => {
    const memberRepository = new FakeMemberRepository();
    const treasurerRepository = new FakeTreasurerRepository();

    const createNewTreasurer = new CreateNewTreasurerService(
      memberRepository,
      treasurerRepository
    ); 

    memberRepository.create({
      id_church: 0,
      batism_date: new Date("1999-12-12"),
      birth_date: new Date("1999-11-12"),
      cpf: BigInt(12312312312),
      email: "email@email.com",
      login: "email",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Member",
    });

    const treasurer = await createNewTreasurer.execute(0);

    expect(treasurer).toBeTruthy();
    expect(treasurer?.id_member).toBe(0);
    expect(treasurer?.startDate).toBeTruthy();
  });
});
