import FakeChurchRepository from "../repositories/fakes/FakeChurchRepository";
import DeactivateChurchService from "./DeactivateChurchService";
import ReactivateChurchService from "./ReactivateChurchService";

describe("ReactivateChurchService", () => {
  it("should reactivate a branch", async () => {
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
    await deactivateChurch.execute(1);

    const reactivateChurch = new ReactivateChurchService(fakeChurchRepository);
    const church = await reactivateChurch.execute(1);

    expect(church?.status).toBe("ACTIVE");
    expect(church?.deactivatedAt).toBeNull();
  });
});
