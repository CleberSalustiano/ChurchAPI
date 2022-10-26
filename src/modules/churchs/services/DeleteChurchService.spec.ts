import FakeChurchRepository from "../repositories/fakes/FakeChurchRepository"
import FakeLocationRepository from "../repositories/fakes/FakeLocationRepository";
import DeleteChurchService from "./DeleteChurchService";

describe("DeleteSomeChurch", () => {
  it("should be possible delete a church", async () => {
    const fakeChurchRepository = new FakeChurchRepository();
    const fakeLocationRepository = new FakeLocationRepository();
    
    const church = await fakeChurchRepository.create({date: "1999-11-12", id_location: 0})
    await (fakeLocationRepository.create({cep: 123, city: "", country: "", district: "", street:"", state: ""}))
    
    if (!church) {
      return false;
    }

    const deleteChurch = new DeleteChurchService(fakeChurchRepository, fakeLocationRepository);
    
    const churchDeleted = await deleteChurch.execute(church.id); 

    const allElements = await fakeChurchRepository.findAll();

    expect(churchDeleted).toBeTruthy();
    expect(allElements?.length).toBe(0);

  })

  it("should not be able delete a church that doesn't exist", () => {
    const fakeChurchRepository = new FakeChurchRepository();
    const fakeLocationRepository = new FakeLocationRepository();
    const deleteChurch = new DeleteChurchService(fakeChurchRepository, fakeLocationRepository);
    
    expect(deleteChurch.execute(1)).rejects.toBeInstanceOf(Error);
  })
})