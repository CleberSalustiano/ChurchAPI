import { sign, SignOptions } from "jsonwebtoken";
import request from "supertest";
import authConfig from "../../config/auth";
import AppError from "../../errors/AppError";

const mockAuthenticateExecute = jest.fn();
const mockGetAuthenticatedProfileExecute = jest.fn();
const mockUpdateUserLoginExecute = jest.fn();
const mockUpdateUserPasswordExecute = jest.fn();

jest.mock("../../container", () => ({
  makeAuthenticateUserService: jest.fn(() => ({
    execute: mockAuthenticateExecute,
  })),
  makeGetAuthenticatedProfileService: jest.fn(() => ({
    execute: mockGetAuthenticatedProfileExecute,
  })),
  makeUpdateUserLoginService: jest.fn(() => ({
    execute: mockUpdateUserLoginExecute,
  })),
  makeUpdateUserPasswordService: jest.fn(() => ({
    execute: mockUpdateUserPasswordExecute,
  })),
}));

import app from "./app";

function makeToken(userId: number) {
  return sign({}, authConfig.jwt.secret, {
    subject: userId.toString(),
    expiresIn: authConfig.jwt.expiresIn as SignOptions["expiresIn"],
  } as SignOptions);
}

describe("Authenticated routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a session with valid credentials", async () => {
    mockAuthenticateExecute.mockResolvedValue({
      token: "jwt.token.value",
      user: { id: 1, login: "member-login" },
      member: {
        id: 1,
        name: "Member Name",
        email: "member@email.com",
        ecclesiasticalRole: "Member",
        id_church: 1,
      },
    });

    const response = await request(app).post("/session").send({
      login: "member-login",
      password: "12345678",
    });

    expect(response.status).toBe(200);
    expect(response.body.user.login).toBe("member-login");
    expect(mockAuthenticateExecute).toHaveBeenCalledWith(
      "member-login",
      "12345678"
    );
  });

  it("should return 401 when the credentials are invalid", async () => {
    mockAuthenticateExecute.mockRejectedValue(
      new AppError("Invalid login or password", 401)
    );

    const response = await request(app).post("/session").send({
      login: "member-login",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid login or password" });
  });

  it("should require a token to access the authenticated profile", async () => {
    const response = await request(app).get("/me");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "JWT token is missing" });
  });

  it("should return the authenticated profile when the token is valid", async () => {
    mockGetAuthenticatedProfileExecute.mockResolvedValue({
      user: { id: 1, login: "member-login" },
      member: {
        id: 1,
        name: "Member Name",
        birth_date: "1990-01-10T00:00:00.000Z",
        batism_date: "2020-10-10T00:00:00.000Z",
        ecclesiasticalRole: "Member",
        cpf: "12345678901",
        rg: 123123123,
        email: "member@email.com",
        foto: null,
        id_church: 1,
      },
    });

    const response = await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual({ id: 1, login: "member-login" });
    expect(mockGetAuthenticatedProfileExecute).toHaveBeenCalledWith(1);
  });

  it("should not allow a user to update another user's login", async () => {
    const response = await request(app)
      .patch("/user/2/login")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .send({ login: "new-login" });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You can only manage your own credentials",
    });
    expect(mockUpdateUserLoginExecute).not.toHaveBeenCalled();
  });

  it("should allow the authenticated user to update their own login", async () => {
    mockUpdateUserLoginExecute.mockResolvedValue({
      id: 1,
      login: "new-login",
      password: "hashed-password",
    });

    const response = await request(app)
      .patch("/user/1/login")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .send({ login: "new-login" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: { id: 1, login: "new-login" },
    });
    expect(mockUpdateUserLoginExecute).toHaveBeenCalledWith(1, "new-login");
  });

  it("should allow the authenticated user to update their own password without exposing it", async () => {
    mockUpdateUserPasswordExecute.mockResolvedValue({
      id: 1,
      login: "member-login",
      password: "hashed-password",
    });

    const response = await request(app)
      .patch("/user/1/password")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .send({ password: "new-secure-password" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: { id: 1, login: "member-login" },
    });
    expect(mockUpdateUserPasswordExecute).toHaveBeenCalledWith(
      1,
      "new-secure-password"
    );
  });
});
