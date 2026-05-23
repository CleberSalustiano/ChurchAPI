import FakeChurchRepository from "../repositories/fakes/FakeChurchRepository";
import DeactivateChurchService from "./DeactivateChurchService";

describe("DeactivateChurchService", () => {
  it("should deactivate a branch", async () => {
    const fakeChurchRepository = new FakeChurchRepository();

    await fakeChurchRepository.create({
      date: "1999-11-12",
      id_location: 0,
      type: "HEADQUARTER",
    });
    await fakeChurchRepository.create({
      date: "1999-11-13",
      id_location: 1,
      type: "BRANCH",
      parent_church_id: 0,
    });

    const deactivateChurch = new DeactivateChurchService(fakeChurchRepository);
    const church = await deactivateChurch.execute(1);

    expect(church?.status).toBe("INACTIVE");
    expect(church?.deactivatedAt).toBeTruthy();
  });
});
