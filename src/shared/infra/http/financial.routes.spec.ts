import { sign, SignOptions } from "jsonwebtoken";
import request from "supertest";
import authConfig from "../../config/auth";

const mockResolveSystemAccessExecute = jest.fn();
const mockUserFindById = jest.fn();
const mockMemberFindByUserId = jest.fn();
const mockCostFindAllByChurch = jest.fn();
const mockCostFindById = jest.fn();
const mockCultFindAllByChurch = jest.fn();
const mockCultFindById = jest.fn();
const mockOfferFindAllByChurch = jest.fn();
const mockOfferFindById = jest.fn();
const mockSpecialOfferFindAllByChurch = jest.fn();
const mockTitheFindAllByChurch = jest.fn();
const mockTitheFindById = jest.fn();
const mockTreasurerFindById = jest.fn();
const mockCreateCostExecute = jest.fn();
const mockDeleteCostExecute = jest.fn();
const mockCreateCultExecute = jest.fn();
const mockDeleteCultExecute = jest.fn();
const mockCreateOfferExecute = jest.fn();
const mockDeleteOfferExecute = jest.fn();
const mockCreateSpecialOfferExecute = jest.fn();
const mockCreateTitheExecute = jest.fn();
const mockDeleteTitheExecute = jest.fn();

jest.mock("../../container", () => ({
  makeResolveSystemAccessService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockResolveSystemAccessExecute(...args),
  })),
  makeCreateCostService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockCreateCostExecute(...args),
  })),
  makeDeleteCostService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockDeleteCostExecute(...args),
  })),
  makeCreateCultService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockCreateCultExecute(...args),
  })),
  makeDeleteCultService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockDeleteCultExecute(...args),
  })),
  makeCreateOfferService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockCreateOfferExecute(...args),
  })),
  makeDeleteOfferService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockDeleteOfferExecute(...args),
  })),
  makeCreateSpecialOfferService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockCreateSpecialOfferExecute(...args),
  })),
  makeCreateTitheService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockCreateTitheExecute(...args),
  })),
  makeDeleteTitheService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockDeleteTitheExecute(...args),
  })),
  userRepository: {
    findById: (...args: unknown[]) => mockUserFindById(...args),
  },
  memberRepository: {
    findByUserId: (...args: unknown[]) => mockMemberFindByUserId(...args),
  },
  costRepository: {
    findAllByChurch: (...args: unknown[]) => mockCostFindAllByChurch(...args),
    findById: (...args: unknown[]) => mockCostFindById(...args),
  },
  cultRepository: {
    findAllByChurch: (...args: unknown[]) => mockCultFindAllByChurch(...args),
    findById: (...args: unknown[]) => mockCultFindById(...args),
  },
  offerRepository: {
    findAllByChurch: (...args: unknown[]) => mockOfferFindAllByChurch(...args),
    findById: (...args: unknown[]) => mockOfferFindById(...args),
  },
  specialOfferRepository: {
    findAllByChurch: (...args: unknown[]) =>
      mockSpecialOfferFindAllByChurch(...args),
  },
  titheRepository: {
    findAllByChurch: (...args: unknown[]) => mockTitheFindAllByChurch(...args),
    findById: (...args: unknown[]) => mockTitheFindById(...args),
  },
  treasurerRepository: {
    findById: (...args: unknown[]) => mockTreasurerFindById(...args),
  },
}));

import app from "./app";

function makeToken(userId: number) {
  return sign({}, authConfig.jwt.secret, {
    subject: userId.toString(),
    expiresIn: authConfig.jwt.expiresIn as SignOptions["expiresIn"],
  } as SignOptions);
}

function mockAuthenticatedUser({
  userId = 1,
  churchId = 3,
  accessScope = "CHURCH",
  accessLevel = "EDITOR",
}: {
  userId?: number;
  churchId?: number;
  accessScope?: "GLOBAL" | "CHURCH";
  accessLevel?: "VIEWER" | "EDITOR";
} = {}) {
  mockUserFindById.mockResolvedValue({
    id: userId,
    login: "member-login",
    password: "hashed-password",
  });

  mockMemberFindByUserId.mockResolvedValue({
    id: 10,
    name: "Member Name",
    email: "member@email.com",
    id_user: userId,
    id_church: churchId,
    church: {
      id: churchId,
      creationDate: new Date("2020-01-01"),
      type: "BRANCH",
      status: "ACTIVE",
      id_location: 1,
    },
  });

  mockResolveSystemAccessExecute.mockResolvedValue({
    level: accessLevel,
    scope: accessScope,
    memberId: 10,
    churchId,
    permissions: {
      canViewManagementData: true,
      canEditManagementData: accessLevel === "EDITOR",
    },
  });

  mockCostFindById.mockResolvedValue({ id: 21, id_church: churchId });
  mockCultFindById.mockResolvedValue({ id: 31, id_church: churchId });
  mockTreasurerFindById.mockResolvedValue({
    id: 41,
    member: { id: 12, id_church: churchId },
  });
  mockOfferFindById.mockResolvedValue({
    id: 51,
    treasurer: {
      member: { id: 12, id_church: churchId },
    },
  });
  mockTitheFindById.mockResolvedValue({
    id: 61,
    specialOffer: { id: 71, id_church: churchId },
  });
}

describe("Financial routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthenticatedUser();
  });

  it("should list costs for the authenticated church scope", async () => {
    mockAuthenticatedUser({ accessLevel: "VIEWER" });
    mockCostFindAllByChurch.mockResolvedValue([
      {
        id: 21,
        value: 350,
        date: new Date("2024-01-10"),
        description: "Sound maintenance",
        id_church: 3,
        deletedAt: null,
      },
    ]);

    const response = await request(app)
      .get("/cost")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(response.status).toBe(200);
    expect(response.body.costs).toHaveLength(1);
    expect(response.body.costs[0].description).toBe("Sound maintenance");
  });

  it("should create and delete a cost inside the authenticated church scope", async () => {
    mockCreateCostExecute.mockResolvedValue({
      id: 21,
      value: 350,
      date: new Date("2024-01-10"),
      description: "Sound maintenance",
      id_church: 3,
      deletedAt: null,
    });
    mockDeleteCostExecute.mockResolvedValue(undefined);

    const createResponse = await request(app)
      .post("/cost")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .send({
        value: 350,
        date: "2024-01-10",
        description: "Sound maintenance",
        id_church: 3,
      });

    const deleteResponse = await request(app)
      .delete("/cost/21")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(createResponse.status).toBe(200);
    expect(createResponse.body.cost.value).toBe(350);
    expect(deleteResponse.status).toBe(204);
    expect(mockDeleteCostExecute).toHaveBeenCalledWith(21);
  });

  it("should list cults for the authenticated church scope", async () => {
    mockAuthenticatedUser({ accessLevel: "VIEWER" });
    mockCultFindAllByChurch.mockResolvedValue([
      {
        id: 31,
        date: new Date("2024-02-15"),
        theme: "Faith and Hope",
        id_church: 3,
        deletedAt: null,
      },
    ]);

    const response = await request(app)
      .get("/cult")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(response.status).toBe(200);
    expect(response.body.cults).toHaveLength(1);
    expect(response.body.cults[0].theme).toBe("Faith and Hope");
  });

  it("should create and delete a cult inside the authenticated church scope", async () => {
    mockCreateCultExecute.mockResolvedValue({
      id: 31,
      date: new Date("2024-02-15"),
      theme: "Faith and Hope",
      id_church: 3,
      deletedAt: null,
    });
    mockDeleteCultExecute.mockResolvedValue(undefined);

    const createResponse = await request(app)
      .post("/cult")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .send({
        date: "2024-02-15",
        theme: "Faith and Hope",
        id_church: 3,
      });

    const deleteResponse = await request(app)
      .delete("/cult/31")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(createResponse.status).toBe(200);
    expect(createResponse.body.cult.theme).toBe("Faith and Hope");
    expect(deleteResponse.status).toBe(204);
    expect(mockDeleteCultExecute).toHaveBeenCalledWith(31);
  });

  it("should list and create offers inside the authenticated church scope", async () => {
    mockAuthenticatedUser({ accessLevel: "VIEWER" });
    mockOfferFindAllByChurch.mockResolvedValue([
      {
        id: 51,
        value: 500,
        id_treasurer: 41,
        deletedAt: null,
      },
    ]);

    const listResponse = await request(app)
      .get("/offer")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.offers).toHaveLength(1);
    expect(listResponse.body.offers[0].value).toBe(500);

    mockAuthenticatedUser({ accessLevel: "EDITOR" });
    mockCreateOfferExecute.mockResolvedValue({
      id: 52,
      value: 700,
      id_treasurer: 41,
      deletedAt: null,
    });

    const createResponse = await request(app)
      .post("/offer")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .send({
        id_treasurer: 41,
        value: 700,
      });

    expect(createResponse.status).toBe(200);
    expect(createResponse.body.offer.value).toBe(700);
  });

  it("should delete an offer inside the authenticated church scope", async () => {
    mockDeleteOfferExecute.mockResolvedValue(undefined);

    const response = await request(app)
      .delete("/offer/51")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(response.status).toBe(204);
    expect(mockDeleteOfferExecute).toHaveBeenCalledWith(51);
  });

  it("should list and create special offers inside the authenticated church scope", async () => {
    mockAuthenticatedUser({ accessLevel: "VIEWER" });
    mockSpecialOfferFindAllByChurch.mockResolvedValue([
      {
        id: 71,
        date: new Date("2024-03-20"),
        reason: "Building project",
        id_offer: 51,
        id_member: 10,
        id_church: 3,
        deletedAt: null,
      },
    ]);

    const listResponse = await request(app)
      .get("/specialOffer")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.specialOffers).toHaveLength(1);
    expect(listResponse.body.specialOffers[0].reason).toBe("Building project");

    mockAuthenticatedUser({ accessLevel: "EDITOR" });
    mockCreateSpecialOfferExecute.mockResolvedValue({
      id: 72,
      date: new Date("2024-03-20"),
      reason: "Building project",
      id_offer: 52,
      id_member: 10,
      id_church: 3,
      deletedAt: null,
    });

    const createResponse = await request(app)
      .post("/specialOffer")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .send({
        id_church: 3,
        id_member: 10,
        id_treasurer: 41,
        value: 1200,
        reason: "Building project",
        date: "2024-03-20",
      });

    expect(createResponse.status).toBe(200);
    expect(createResponse.body.newSpecialOfferService.reason).toBe(
      "Building project"
    );
  });

  it("should list, create and delete tithes inside the authenticated church scope", async () => {
    mockAuthenticatedUser({ accessLevel: "VIEWER" });
    mockTitheFindAllByChurch.mockResolvedValue([
      {
        id: 61,
        month: 4,
        year: 2024,
        id_special_offer: 71,
        deletedAt: null,
      },
    ]);

    const listResponse = await request(app)
      .get("/tithe")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.tithes).toHaveLength(1);
    expect(listResponse.body.tithes[0].month).toBe(4);

    mockAuthenticatedUser({ accessLevel: "EDITOR" });
    mockCreateTitheExecute.mockResolvedValue({
      id: 62,
      month: 5,
      year: 2024,
      id_special_offer: 72,
      deletedAt: null,
    });
    mockDeleteTitheExecute.mockResolvedValue(undefined);

    const createResponse = await request(app)
      .post("/tithe")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .send({
        id_church: 3,
        id_member: 10,
        reason: "Monthly tithe",
        date: "2024-04-10",
        month: 5,
        year: 2024,
        value: 800,
        id_treasurer: 41,
      });

    const deleteResponse = await request(app)
      .delete("/tithe/61")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(createResponse.status).toBe(200);
    expect(createResponse.body.tithe.month).toBe(5);
    expect(deleteResponse.status).toBe(204);
    expect(mockDeleteTitheExecute).toHaveBeenCalledWith(61);
  });
});
