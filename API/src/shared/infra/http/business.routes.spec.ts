import { sign, SignOptions } from "jsonwebtoken";
import request from "supertest";
import authConfig from "../../config/auth";

const mockResolveSystemAccessExecute = jest.fn();
const mockUserFindById = jest.fn();
const mockMemberFindByUserId = jest.fn();
const mockMemberFindById = jest.fn();
const mockMemberFindAll = jest.fn();
const mockMemberFindAllByChurch = jest.fn();
const mockManagerFindById = jest.fn();
const mockManagerFindAllActive = jest.fn();
const mockManagerFindAllByChurch = jest.fn();
const mockManagerFindByMember = jest.fn();
const mockChurchFindById = jest.fn();
const mockChurchFindAll = jest.fn();
const mockCreateChurchExecute = jest.fn();
const mockCreateStructuredChurchExecute = jest.fn();
const mockDeactivateChurchExecute = jest.fn();
const mockReactivateChurchExecute = jest.fn();
const mockDeleteChurchExecute = jest.fn();
const mockCreateMemberExecute = jest.fn();
const mockDeleteMemberExecute = jest.fn();
const mockDeleteManagerExecute = jest.fn();
const mockReplaceManagerExecute = jest.fn();

jest.mock("../../container", () => ({
  makeResolveSystemAccessService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockResolveSystemAccessExecute(...args),
  })),
  makeCreateChurchService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockCreateChurchExecute(...args),
  })),
  makeCreateChurchWithInitialManagerService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockCreateStructuredChurchExecute(...args),
  })),
  makeDeactivateChurchService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockDeactivateChurchExecute(...args),
  })),
  makeReactivateChurchService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockReactivateChurchExecute(...args),
  })),
  makeDeleteChurchService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockDeleteChurchExecute(...args),
  })),
  makeCreateMemberService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockCreateMemberExecute(...args),
  })),
  makeDeleteMemberService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockDeleteMemberExecute(...args),
  })),
  makeDeleteManagerService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockDeleteManagerExecute(...args),
  })),
  makeReplaceManagerService: jest.fn(() => ({
    execute: (...args: unknown[]) => mockReplaceManagerExecute(...args),
  })),
  userRepository: {
    findById: (...args: unknown[]) => mockUserFindById(...args),
  },
  churchRepository: {
    findById: (...args: unknown[]) => mockChurchFindById(...args),
    findAll: (...args: unknown[]) => mockChurchFindAll(...args),
  },
  managerRepository: {
    findById: (...args: unknown[]) => mockManagerFindById(...args),
    findAllActive: (...args: unknown[]) => mockManagerFindAllActive(...args),
    findAllbyChurch: (...args: unknown[]) => mockManagerFindAllByChurch(...args),
    findByMember: (...args: unknown[]) => mockManagerFindByMember(...args),
  },
  memberRepository: {
    findByUserId: (...args: unknown[]) => mockMemberFindByUserId(...args),
    findById: (...args: unknown[]) => mockMemberFindById(...args),
    findAll: (...args: unknown[]) => mockMemberFindAll(...args),
    findAllbyChurch: (...args: unknown[]) => mockMemberFindAllByChurch(...args),
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
  churchId = 1,
  churchType = "BRANCH",
  accessScope = "CHURCH",
  accessLevel = "EDITOR",
}: {
  userId?: number;
  churchId?: number;
  churchType?: "HEADQUARTER" | "BRANCH";
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
      type: churchType,
      status: "ACTIVE",
      id_location: 1,
    },
  });

  mockMemberFindById.mockResolvedValue({
    id: 4,
    id_church: churchId,
  });

  mockManagerFindById.mockResolvedValue({
    id: 7,
    id_church: churchId,
    id_member: 4,
    startDate: new Date("2024-01-10"),
    endDate: null,
  });

  mockManagerFindAllActive.mockResolvedValue([]);
  mockManagerFindAllByChurch.mockResolvedValue([]);
  mockManagerFindByMember.mockResolvedValue(undefined);

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
}

describe("Business routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthenticatedUser();
  });

  it("should create a church for a global editor", async () => {
    mockAuthenticatedUser({
      churchId: 1,
      churchType: "HEADQUARTER",
      accessScope: "GLOBAL",
      accessLevel: "EDITOR",
    });

    mockCreateChurchExecute.mockResolvedValue({
      id: 2,
      creationDate: new Date("2024-01-15"),
      type: "BRANCH",
      status: "ACTIVE",
      parentChurchId: 1,
      deactivatedAt: null,
      deletedAt: null,
      id_location: 2,
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
        cep: 1001000,
        type: "BRANCH",
      });

    expect(response.status).toBe(200);
    expect(response.body.church.type).toBe("BRANCH");
    expect(mockCreateChurchExecute).toHaveBeenCalledWith(
      { date: "2024-01-15", id_location: -1, type: "BRANCH" },
      {
        cep: 1001000,
        city: "Sao Paulo",
        country: "Brasil",
        district: "Centro",
        state: "SP",
        street: "Rua das Flores",
      }
    );
  });

  it("should create a church with its initial manager for a global editor", async () => {
    mockAuthenticatedUser({
      churchId: 1,
      churchType: "HEADQUARTER",
      accessScope: "GLOBAL",
      accessLevel: "EDITOR",
    });

    mockCreateStructuredChurchExecute.mockResolvedValue({
      church: {
        id: 2,
        creationDate: new Date("2024-01-15"),
        type: "BRANCH",
        status: "ACTIVE",
        parentChurchId: 1,
        id_location: 2,
      },
      manager: {
        id: 8,
        id_church: 2,
        id_member: 12,
        startDate: new Date("2024-01-15"),
      },
      member: {
        id: 12,
        name: "Joao da Silva",
        cpf: "12345678901",
      },
      user: {
        id: 4,
        login: "joao.silva",
      },
    });

    const payload = {
      church: {
        date: "2024-01-15",
        street: "Rua das Flores",
        district: "Centro",
        city: "Sao Paulo",
        state: "SP",
        country: "Brasil",
        cep: 1001000,
        type: "BRANCH",
      },
      manager: {
        name: "Joao da Silva",
        birth_date: "1990-01-10",
        batism_date: "2005-02-20",
        ecclesiasticalRole: "Dirigente",
        cpf: "12345678901",
        rg: 123456789,
        login: "joao.silva",
        email: "joao@email.com",
        password: "1234",
      },
    };

    const response = await request(app)
      .post("/church/structured")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body.manager.id_member).toBe(12);
    expect(mockCreateStructuredChurchExecute).toHaveBeenCalledWith(payload);
  });

  it("should deactivate and reactivate a church for a global editor", async () => {
    mockAuthenticatedUser({
      churchId: 1,
      churchType: "HEADQUARTER",
      accessScope: "GLOBAL",
      accessLevel: "EDITOR",
    });

    mockDeactivateChurchExecute.mockResolvedValue({
      id: 2,
      status: "INACTIVE",
    });
    mockReactivateChurchExecute.mockResolvedValue({
      id: 2,
      status: "ACTIVE",
    });

    const deactivateResponse = await request(app)
      .patch("/church/2/deactivate")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    const reactivateResponse = await request(app)
      .patch("/church/2/reactivate")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(deactivateResponse.status).toBe(200);
    expect(deactivateResponse.body.church.status).toBe("INACTIVE");
    expect(reactivateResponse.status).toBe(200);
    expect(reactivateResponse.body.church.status).toBe("ACTIVE");
  });

  it("should delete a church logically for a global editor", async () => {
    mockAuthenticatedUser({
      churchId: 1,
      churchType: "HEADQUARTER",
      accessScope: "GLOBAL",
      accessLevel: "EDITOR",
    });
    mockDeleteChurchExecute.mockResolvedValue(undefined);

    const response = await request(app)
      .delete("/church/2")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(response.status).toBe(204);
    expect(mockDeleteChurchExecute).toHaveBeenCalledWith(2);
  });

  it("should list only the authenticated church when the scope is CHURCH", async () => {
    mockAuthenticatedUser({
      churchId: 3,
      churchType: "BRANCH",
      accessScope: "CHURCH",
      accessLevel: "VIEWER",
    });
    mockChurchFindById.mockResolvedValue({
      id: 3,
      creationDate: new Date("2020-01-01"),
      type: "BRANCH",
      status: "ACTIVE",
      parentChurchId: 1,
      deactivatedAt: null,
      deletedAt: null,
      id_location: 3,
    });

    const response = await request(app)
      .get("/church")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(response.status).toBe(200);
    expect(response.body.churches).toHaveLength(1);
    expect(response.body.churches[0].id).toBe(3);
    expect(mockChurchFindAll).not.toHaveBeenCalled();
  });

  it("should create a member inside the authenticated branch scope", async () => {
    mockAuthenticatedUser({
      churchId: 3,
      churchType: "BRANCH",
      accessScope: "CHURCH",
      accessLevel: "EDITOR",
    });

    mockCreateMemberExecute.mockResolvedValue({
      id: 4,
      name: "New Member",
      birth_date: new Date("1995-02-10"),
      batism_date: new Date("2020-05-20"),
      ecclesiasticalRole: "Member",
      cpf: BigInt("12345678901"),
      rg: 123456,
      email: "new.member@email.com",
      foto: null,
      id_church: 3,
      id_user: 7,
    });

    const response = await request(app)
      .post("/member")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .send({
        id_church: 3,
        name: "New Member",
        birth_date: "1995-02-10",
        batism_date: "2020-05-20",
        ecclesiasticalRole: "Member",
        cpf: "12345678901",
        rg: 123456,
        login: "new-member",
        email: "new.member@email.com",
        password: "StrongPassword123",
      });

    expect(response.status).toBe(200);
    expect(response.body.member.cpf).toBe("12345678901");
    expect(response.body.member.id_church).toBe(3);
  });

  it("should replace a manager assignment without leaving the church unmanaged", async () => {
    mockAuthenticatedUser({
      churchId: 3,
      churchType: "BRANCH",
      accessScope: "CHURCH",
      accessLevel: "EDITOR",
    });

    mockReplaceManagerExecute.mockResolvedValue({
      previousManager: {
        id: 7,
        id_church: 3,
        id_member: 4,
        endDate: new Date("2024-04-20"),
      },
      manager: {
        id: 9,
        id_church: 3,
        id_member: 6,
        startDate: new Date("2024-04-20"),
      },
    });

    const response = await request(app)
      .post("/manager/7/replace")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .send({
        id_member: 6,
      });

    expect(response.status).toBe(200);
    expect(response.body.manager.id_member).toBe(6);
    expect(mockReplaceManagerExecute).toHaveBeenCalledWith({
      id_manager: 7,
      id_member: 6,
    });
  });

  it("should list scoped members with cpf serialized as string", async () => {
    mockAuthenticatedUser({
      churchId: 3,
      churchType: "BRANCH",
      accessScope: "CHURCH",
      accessLevel: "VIEWER",
    });

    mockMemberFindAllByChurch.mockResolvedValue([
      {
        id: 4,
        name: "Scoped Member",
        birth_date: new Date("1995-02-10"),
        batism_date: new Date("2020-05-20"),
        ecclesiasticalRole: "Member",
        cpf: BigInt("12345678901"),
        rg: 123456,
        email: "scoped.member@email.com",
        foto: null,
        deletedAt: null,
        id_church: 3,
        id_user: 7,
      },
    ]);

    const response = await request(app)
      .get("/member")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(response.status).toBe(200);
    expect(response.body.members).toHaveLength(1);
    expect(response.body.members[0].cpf).toBe("12345678901");
    expect(mockMemberFindAll).not.toHaveBeenCalled();
  });

  it("should delete a member logically inside the authenticated scope", async () => {
    mockAuthenticatedUser({
      churchId: 3,
      churchType: "BRANCH",
      accessScope: "CHURCH",
      accessLevel: "EDITOR",
    });
    mockDeleteMemberExecute.mockResolvedValue(undefined);

    const response = await request(app)
      .delete("/member/4")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(response.status).toBe(204);
    expect(mockDeleteMemberExecute).toHaveBeenCalledWith(4);
  });
});
