import FakeChurchRepository from "../repositories/fakes/FakeChurchRepository";
import FakeLocationRepository from "../repositories/fakes/FakeLocationRepository";
import CreateNewChurchService from "./CreateNewChurchService";

describe("CreateChurchCorrectly", () => {
  it("should be possible to create a new Church", async () => {
    const fakeChurchRepository = new FakeChurchRepository();
    const fakeLocationRepository = new FakeLocationRepository();

    const createNewChurch = new CreateNewChurchService(
      fakeChurchRepository,
      fakeLocationRepository
    );

    const dataChurch = {
      date: "1999-11-12",
      id_location: 0,
    };

    const dataLocation = {
      street: "rua",
      cep: 123,
      city: "aoba",
      country: "bão",
      district: "tres",
      state: "1223",
    };

    const church = await createNewChurch.execute(dataChurch, dataLocation);

    expect(church?.id).toBe(0);
    expect(church?.creationDate.toString()).toBe(
      new Date("1999-11-12").toString()
    );
    expect(church?.id_location).toBe(0);
    expect(church?.type).toBe("HEADQUARTER");
    expect(church?.status).toBe("ACTIVE");
  });

  it("should create a branch after the headquarter already exists", async () => {
    const fakeChurchRepository = new FakeChurchRepository();
    const fakeLocationRepository = new FakeLocationRepository();

    const createNewChurch = new CreateNewChurchService(
      fakeChurchRepository,
      fakeLocationRepository
    );

    await createNewChurch.execute(
      { date: "1999-11-12", id_location: 0 },
      {
        street: "rua um",
        cep: 123,
        city: "aoba",
        country: "bao",
        district: "tres",
        state: "1223",
      }
    );

    const branch = await createNewChurch.execute(
      { date: "1999-11-13", id_location: 0 },
      {
        street: "rua dois",
        cep: 124,
        city: "cidade",
        country: "bao",
        district: "quatro",
        state: "1223",
      }
    );

    expect(branch?.type).toBe("BRANCH");
    expect(branch?.parentChurchId).toBe(0);
  });

  it("should not be possible to create two Church with the same location", async () => {
    const fakeChurchRepository = new FakeChurchRepository();
    const fakeLocationRepository = new FakeLocationRepository();

    const createNewChurch = new CreateNewChurchService(
      fakeChurchRepository,
      fakeLocationRepository
    );

    fakeChurchRepository.create({
      date: "1999-12-12",
      id_location: 0,
    });

    const dataChurch = {
      date: "1999-11-12",
      id_location: 0,
    };

    const dataLocation = {
      street: "rua",
      cep: 123,
      city: "aoba",
      country: "bão",
      district: "tres",
      state: "1223",
    };

    expect(createNewChurch.execute(dataChurch, dataLocation)).rejects.toBeInstanceOf(Error);
  });

  it("should not be possible to create another headquarter when one already exists", async () => {
    const fakeChurchRepository = new FakeChurchRepository();
    const fakeLocationRepository = new FakeLocationRepository();

    const createNewChurch = new CreateNewChurchService(
      fakeChurchRepository,
      fakeLocationRepository
    );

    await createNewChurch.execute(
      { date: "1999-11-12", id_location: 0 },
      {
        street: "rua um",
        cep: 123,
        city: "aoba",
        country: "bao",
        district: "tres",
        state: "1223",
      }
    );

    expect(
      createNewChurch.execute(
        { date: "1999-11-13", id_location: 0, type: "HEADQUARTER" },
        {
          street: "rua dois",
          cep: 124,
          city: "cidade",
          country: "bao",
          district: "quatro",
          state: "1223",
        }
      )
    ).rejects.toBeInstanceOf(Error);
  });
});
