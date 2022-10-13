import NoExistError from "../../../shared/errors/NoExistError";
import FakeMemberRepository from "../../members/repositories/fakes/FakeMemberRepository";
import FakeTreasurerRepository from "../repositories/fakes/FakeTreasurerRepository";
import UpdateTreasurerService from "./UpdateTreasurerService";

describe("Update new Treasurer", () => {
  it("should be able to update a treasurer", async () => {
    const memberRepository = new FakeMemberRepository();
    const treasurerRepository = new FakeTreasurerRepository();

    const updateTreasurer = new UpdateTreasurerService(
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

    memberRepository.create({
      id_church: 0,
      batism_date: new Date("1999-12-12"),
      birth_date: new Date("1999-11-12"),
      cpf: BigInt(12312212312),
      email: "email@email.com",
      login: "email",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Member",
    });

    treasurerRepository.create(0);

    const treasurer = await updateTreasurer.execute({
      id_member: 1,
      id_treasurer: 0,
    });

    expect(treasurer).toBeTruthy();
    expect(treasurer?.id_member).toBe(1);
  });
  it("should not be able to update treasurer than doesn't exist", async () => {
    const memberRepository = new FakeMemberRepository();
    const treasurerRepository = new FakeTreasurerRepository();

    const updateTreasurer = new UpdateTreasurerService(
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

    memberRepository.create({
      id_church: 0,
      batism_date: new Date("1999-12-12"),
      birth_date: new Date("1999-11-12"),
      cpf: BigInt(12312212312),
      email: "email@email.com",
      login: "email",
      name: "Luvas Piruvicas",
      password: "6969",
      rg: 123123,
      titleChurch: "Member",
    });

    expect(
      updateTreasurer.execute({ id_member: 1, id_treasurer: 0 })
    ).rejects.toThrowError(NoExistError);
  });
  it("should not be able to update a treasurer with a member than doesn't exist", () => {
    const memberRepository = new FakeMemberRepository();
    const treasurerRepository = new FakeTreasurerRepository();

    const updateTreasurer = new UpdateTreasurerService(
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
    treasurerRepository.create(0);

    expect(
      updateTreasurer.execute({ id_member: 1, id_treasurer: 0 })
    ).rejects.toThrowError(NoExistError);
  });
});
