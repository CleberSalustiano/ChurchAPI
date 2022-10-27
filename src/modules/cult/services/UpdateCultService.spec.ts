import DateError from "../../../shared/errors/DateError";
import NoExistError from "../../../shared/errors/NoExistError";
import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import FakeCultRepository from "../repositories/fakes/FakeCultRepository";
import UpdateCultService from "./UpdateCultService";

describe("Update a cult", () => {
  it("should be able to update a cult", async () => {
    const cultRepository = new FakeCultRepository();
    const churchRepository = new FakeChurchRepository();

    const updateCult = new UpdateCultService(cultRepository, churchRepository);

    churchRepository.create({ date: "2000-12-12", id_location: 0 });
    churchRepository.create({ date: "2000-12-14", id_location: 1 });

    cultRepository.create({
      date: "2015-12-13",
      id_church: 0,
      theme: "Culto do amigo",
    });

    const cult = await updateCult.execute({
      date: "2020-12-24",
      id_church: 1,
      theme: "Culto da palavra",
      id_cult: 0,
    });

    expect(cult).toBeTruthy();
    expect(cult.theme).toBe("Culto da palavra");
  });

  it("should not be able to update a cult that doesn't exist", async () => {
    const cultRepository = new FakeCultRepository();
    const churchRepository = new FakeChurchRepository();

    const updateCult = new UpdateCultService(cultRepository, churchRepository);

    churchRepository.create({ date: "2000-12-12", id_location: 0 });
    churchRepository.create({ date: "2000-12-14", id_location: 1 });

    expect(
      updateCult.execute({
        date: "2020-12-24",
        id_church: 1,
        theme: "Culto da palavra",
        id_cult: 0,
      })
    ).rejects.toBeInstanceOf(NoExistError);
  });

  it("should not be able to update a cult that church doesn't exist", () => {
    const cultRepository = new FakeCultRepository();
    const churchRepository = new FakeChurchRepository();

    const updateCult = new UpdateCultService(cultRepository, churchRepository);

    churchRepository.create({ date: "2000-12-12", id_location: 0 });

    cultRepository.create({
      date: "2015-12-13",
      id_church: 0,
      theme: "Culto do amigo",
    });

    expect(
      updateCult.execute({
        date: "2020-12-24",
        id_church: 1,
        theme: "Culto da palavra",
        id_cult: 0,
      })
    ).rejects.toBeInstanceOf(NoExistError);
  });
  
  it("should not be able to update a cult that date incorrect formar", () => {
    const cultRepository = new FakeCultRepository();
    const churchRepository = new FakeChurchRepository();

    const updateCult = new UpdateCultService(cultRepository, churchRepository);

    churchRepository.create({ date: "2000-12-12", id_location: 0 });
    churchRepository.create({ date: "2000-12-14", id_location: 1 });

    cultRepository.create({
      date: "2015-12-13",
      id_church: 0,
      theme: "Culto do amigo",
    });


    expect(updateCult.execute({
      date: "2020-1224",
      id_church: 1,
      theme: "Culto da palavra",
      id_cult: 0,
    })).rejects.toBeInstanceOf(DateError);
  })
});
