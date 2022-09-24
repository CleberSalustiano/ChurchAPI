import FakeChurchRepository from "../repositories/fakes/FakeChurchRepository"
import FakeLocationRepository from "../repositories/fakes/FakeLocationRepository";
import UpdateChurchService from "./UpdateChurchService";

describe("UpdateChurch", () => {
  it("should be possible to update a church", async () => {
    const fakeChurchRepository = new FakeChurchRepository();
    const fakeLocationRepository = new FakeLocationRepository();

    const church = await fakeChurchRepository.create({date: new Date("1999-11-12"), id_location: 0})
    await (fakeLocationRepository.create({cep: 123, city: "", country: "", district: "", street:"", state: ""}))

    const updateChurch = new UpdateChurchService(fakeChurchRepository, fakeLocationRepository);

    if (!church)
      return false;
    
    const dataChurch = {
      date: new Date("1000-10-10"),
      id_church: 0
    }

    const dataLocation = {
      street : "rua",
      cep: 1243,
      city: "aoba",
      country: "bão",
      district: "tres",
      state: "1223",
      id_location: 0
    }
      
    const churchUpdated = await updateChurch.execute(dataChurch, dataLocation);

    expect(churchUpdated).toBeTruthy();
    expect(churchUpdated?.id).toBe(0);
    expect(churchUpdated?.creationDate.toString()).toBe(new Date("1000-10-10").toString());

  })
})