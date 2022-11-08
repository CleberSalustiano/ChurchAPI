import FakeChurchRepository from "../../churchs/repositories/fakes/FakeChurchRepository";
import FakeCostRepository from "../repositories/fakes/FakeCostRepository"
import CreateNewCostService from "./CreateNewCostService";

describe("Create new cost", () => {
  it("should be able to create a new cost", async () => {
    const costRepository = new FakeCostRepository();
    const churchRepository = new FakeChurchRepository();

    const createNewCost = new CreateNewCostService(costRepository, churchRepository);

    churchRepository.create({date: "2020-11-08", id_location: 2})

    const cost = await createNewCost.execute({date: "2022-11-02", description: "Descrição", id_church: 0, value: 1230})

    expect(cost).toBeTruthy()
    expect(cost.value).toBe(1230)
  })
})