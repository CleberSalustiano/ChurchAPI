import { sign, SignOptions } from "jsonwebtoken";
import authConfig from "../../config/auth";

var mockResolveSystemAccessExecute = jest.fn();
var mockMemberFindById = jest.fn();
var mockManagerFindById = jest.fn();
var mockCostFindById = jest.fn();
var mockCultFindById = jest.fn();

jest.mock("../../container", () => ({
  makeResolveSystemAccessService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockResolveSystemAccessExecute(...args),
  })),
  memberRepository: {
    findById: (...args: unknown[]) => mockMemberFindById(...args),
  },
  managerRepository: {
    findById: (...args: unknown[]) => mockManagerFindById(...args),
  },
  costRepository: {
    findById: (...args: unknown[]) => mockCostFindById(...args),
  },
  cultRepository: {
    findById: (...args: unknown[]) => mockCultFindById(...args),
  },
}));

import request from "supertest";
import app from "./app";

function makeToken(userId: number) {
  return sign({}, authConfig.jwt.secret, {
    subject: userId.toString(),
    expiresIn: authConfig.jwt.expiresIn as SignOptions["expiresIn"],
  } as SignOptions);
}

describe("Authorization routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should require authentication to list churches", async () => {
    const response = await request(app).get("/church");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "JWT token is missing" });
  });

  it("should forbid members without viewer access from listing churches", async () => {
    mockResolveSystemAccessExecute.mockResolvedValue({
      level: "MEMBER",
      scope: "CHURCH",
      memberId: 1,
      churchId: 1,
      permissions: {
        canViewManagementData: false,
        canEditManagementData: false,
      },
    });

    const response = await request(app)
      .get("/church")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You do not have permission to access this resource",
    });
  });

  it("should forbid viewers from editing churches", async () => {
    mockResolveSystemAccessExecute.mockResolvedValue({
      level: "VIEWER",
      scope: "CHURCH",
      memberId: 1,
      churchId: 1,
      permissions: {
        canViewManagementData: true,
        canEditManagementData: false,
      },
    });

    const response = await request(app)
      .post("/church")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .send({
        date: "2024-01-15",
        street: "Rua das Flores",
        district: "Centro",
        city: "Sao Paulo",
        state: "SP",
        country: "Brasil",
        cep: "01001000",
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You do not have permission to access this resource",
    });
  });

  it("should forbid branch editors from managing churches globally", async () => {
    mockResolveSystemAccessExecute.mockResolvedValue({
      level: "EDITOR",
      scope: "CHURCH",
      memberId: 1,
      churchId: 1,
      permissions: {
        canViewManagementData: true,
        canEditManagementData: true,
      },
    });

    const response = await request(app)
      .post("/church")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .send({
        date: "2024-01-15",
        street: "Rua das Flores",
        district: "Centro",
        city: "Sao Paulo",
        state: "SP",
        country: "Brasil",
        cep: "01001000",
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You do not have permission to manage data outside your church scope",
    });
  });

  it("should forbid branch viewers from requesting members from another church", async () => {
    mockResolveSystemAccessExecute.mockResolvedValue({
      level: "VIEWER",
      scope: "CHURCH",
      memberId: 1,
      churchId: 1,
      permissions: {
        canViewManagementData: true,
        canEditManagementData: false,
      },
    });

    const response = await request(app)
      .get("/member/2")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You do not have permission to manage data outside your church scope",
    });
  });

  it("should forbid branch editors from deleting a member from another church", async () => {
    mockResolveSystemAccessExecute.mockResolvedValue({
      level: "EDITOR",
      scope: "CHURCH",
      memberId: 1,
      churchId: 1,
      permissions: {
        canViewManagementData: true,
        canEditManagementData: true,
      },
    });
    mockMemberFindById.mockResolvedValue({
      id: 99,
      id_church: 2,
    });

    const response = await request(app)
      .delete("/member/99")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You do not have permission to manage data outside your church scope",
    });
  });
});
