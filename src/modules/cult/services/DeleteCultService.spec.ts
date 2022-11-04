import NoExistError from "../../../shared/errors/NoExistError";
import FakeCultRepository from "../repositories/fakes/FakeCultRepository"
import DeleteCultService from "./DeleteCultService";

describe("Delete cult ",  () => {
  it("should be able to delete a cult", async () => {
    const cultRepository = new FakeCultRepository();
    const deleteCult = new DeleteCultService(cultRepository);
    const cult = await cultRepository.create({date: "2022-10-09", id_church: 0, theme: "Culto do amigo" })
      
    const cultDeleted = await deleteCult.execute(0);

    expect(cultDeleted).toBeTruthy();
    expect(cultDeleted.id).toBe(0);
  })

  it("should not be able to delete a cult than doesn't exist", async () => {
    const cultRepository = new FakeCultRepository();
    const deleteCult = new DeleteCultService(cultRepository);
      
    expect(deleteCult.execute(0)).rejects.toThrowError(NoExistError);
  })
})