import DateError from "../../../shared/errors/DateError";
import NoExistError from "../../../shared/errors/NoExistError";
import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import FakeCultRepository from "../repositories/fakes/FakeCultRepository";
import CreateNewCultService from "./CreateNewCultService";

describe("Create a new Cult", () => {
  it("should be able to create a new Cult", async () => {
    const cultRepository = new FakeCultRepository();
    const churchRepository = new FakeChurchRepository();

    const createNewCult = new CreateNewCultService(
      cultRepository,
      churchRepository
    );

    churchRepository.create({ date: "1999-12-12", id_location: 0 });

    const cult = await createNewCult.execute({
      date: "2020-08-14",
      theme: "Culto do Amigo",
      id_church: 0,
    });

    expect(cult).toBeTruthy();
    expect(cult.id_church).toBe(0);
  });

  it("should not be able that church doesn't exist", () => {
    const cultRepository = new FakeCultRepository();
    const churchRepository = new FakeChurchRepository();

    const createNewCult = new CreateNewCultService(
      cultRepository,
      churchRepository
    );

    expect(createNewCult.execute({
      date: "2020-08-14",
      theme: "Culto do Amigo",
      id_church: 0,
    })).rejects.toThrowError(NoExistError);
  })

  it("should not be able date incorret format", () => {
    const cultRepository = new FakeCultRepository();
    const churchRepository = new FakeChurchRepository();

    const createNewCult = new CreateNewCultService(
      cultRepository,
      churchRepository
    );
    churchRepository.create({ date: "1999-12-12", id_location: 0 });

    expect(createNewCult.execute({
      date: "2020-0814",
      theme: "Culto do Amigo",
      id_church: 0,
    })).rejects.toThrowError(DateError);
  })
});
