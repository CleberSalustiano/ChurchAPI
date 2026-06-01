import NoExistError from "../../../shared/errors/NoExistError";
import FakeCostRepository from "../repositories/fakes/FakeCostRepository";
import DeleteCostService from "./DeleteCostService";

describe("Delete cost", () => {
  it("should be able to delete a cost", async () => {
    const costRepository = new FakeCostRepository();
    const deleteCost = new DeleteCostService(costRepository);

    await costRepository.create({
      date: "2024-01-15",
      description: "Sound system maintenance",
      id_church: 1,
      value: 350,
    });

    const deletedCost = await deleteCost.execute(0);
    const hiddenCost = await costRepository.findById(0);

    expect(deletedCost).toBeTruthy();
    expect(deletedCost.id).toBe(0);
    expect(hiddenCost).toBeUndefined();
  });

  it("should not be able to delete a cost that doesn't exist", async () => {
    const costRepository = new FakeCostRepository();
    const deleteCost = new DeleteCostService(costRepository);

    await expect(deleteCost.execute(0)).rejects.toThrowError(NoExistError);
  });
});
