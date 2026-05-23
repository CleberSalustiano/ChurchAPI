import FakeChurchRepository from "../repositories/fakes/FakeChurchRepository"
import FakeLocationRepository from "../repositories/fakes/FakeLocationRepository";
import DeleteChurchService from "./DeleteChurchService";

describe("DeleteSomeChurch", () => {
  it("should be possible logically delete a branch", async () => {
    const fakeChurchRepository = new FakeChurchRepository();
    const fakeLocationRepository = new FakeLocationRepository();

    await fakeChurchRepository.create({
      date: "1999-11-12",
      id_location: 0,
      type: "HEADQUARTER",
    });
    const church = await fakeChurchRepository.create({
      date: "1999-11-13",
      id_location: 1,
      type: "BRANCH",
      parent_church_id: 0,
    });
    await fakeLocationRepository.create({cep: 123, city: "", country: "", district: "", street:"", state: ""})

    if (!church) return false;

    const deleteChurch = new DeleteChurchService(fakeChurchRepository);

    const churchDeleted = await deleteChurch.execute(church.id);

    const allElements = await fakeChurchRepository.findAll();

    expect(churchDeleted).toBeTruthy();
    expect(allElements?.length).toBe(2);
    expect(allElements?.[1].status).toBe("DELETED");
    expect(allElements?.[1].deletedAt).toBeTruthy();

  })

  it("should not be able delete a church that doesn't exist", () => {
    const fakeChurchRepository = new FakeChurchRepository();
    const deleteChurch = new DeleteChurchService(fakeChurchRepository);
    
    expect(deleteChurch.execute(1)).rejects.toBeInstanceOf(Error);
  })

  it("should not be able delete the headquarter", async () => {
    const fakeChurchRepository = new FakeChurchRepository();

    await fakeChurchRepository.create({
      date: "1999-11-12",
      id_location: 0,
      type: "HEADQUARTER",
    });

    const deleteChurch = new DeleteChurchService(fakeChurchRepository);

    expect(deleteChurch.execute(0)).rejects.toBeInstanceOf(Error);
  })
})
