import { sign, SignOptions } from "jsonwebtoken";
import authConfig from "../../config/auth";

const mockResolveSystemAccessExecute = jest.fn();

jest.mock("../../container", () => ({
  makeResolveSystemAccessService: jest.fn(() => ({
    execute: mockResolveSystemAccessExecute,
  })),
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
});
