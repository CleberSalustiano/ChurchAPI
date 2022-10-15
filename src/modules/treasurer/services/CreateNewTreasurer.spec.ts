import NoExistError from "../../../shared/errors/NoExistError";
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
      batism_date: "1999-12-12",
      birth_date: "1999-11-12",
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

  it("should not be able to create a treasure with a unexistent member", async () => {
    const memberRepository = new FakeMemberRepository();
    const treasurerRepository = new FakeTreasurerRepository();

    const createNewTreasurer = new CreateNewTreasurerService(
      memberRepository,
      treasurerRepository
    );

    expect(createNewTreasurer.execute(0)).rejects.toThrowError(NoExistError);
  });
});
