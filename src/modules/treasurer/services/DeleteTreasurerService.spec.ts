import NoExistError from "../../../shared/errors/NoExistError";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeTreasurerRepository from "../repositories/fakes/FakeTreasurerRepository";
import DeleteTreasurerService from "./DeleteTreasurerService";

describe("Delete Treasurer (desactive)", () => {
  it("should be able to delete a treasurer", async () => {
    const memberRepository = new FakeMemberRepository();
    const treasurerRepository = new FakeTreasurerRepository();

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

    const treasurer = await treasurerRepository.create(0);

    const deleteTreasurer = new DeleteTreasurerService(treasurerRepository);

    const treasurerDeleted = await deleteTreasurer.execute(0);

    expect(treasurerDeleted).toBeTruthy();
    expect(treasurerDeleted.endDate).toBeTruthy();
  });

  it("should not be able to delete a treasurer that doesn't exist", async () => {
    const memberRepository = new FakeMemberRepository();
    const treasurerRepository = new FakeTreasurerRepository();

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

    const deleteTreasurer = new DeleteTreasurerService(treasurerRepository);

    expect(deleteTreasurer.execute(0)).rejects.toThrowError(NoExistError);
  });
});
