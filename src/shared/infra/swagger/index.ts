const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const port = process.env.PORT || "3333";
const baseUrl = process.env.API_BASE_URL || `http://localhost:${port}`;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ChurchAPI",
      version: "1.0.0",
      description:
        "API para gestao de igreja, congregacoes, membros e movimentacoes financeiras.",
    },
    servers: [
      {
        url: baseUrl,
        description: "Current environment",
      },
    ],
    tags: [
      { name: "System", description: "Operational endpoints" },
      { name: "Auth", description: "Authentication and session management" },
      { name: "Church", description: "Church and location management" },
      { name: "Cult", description: "Cult management" },
      { name: "Cost", description: "Cost management" },
      { name: "Member", description: "Member management" },
      { name: "User", description: "User credential management" },
      { name: "Manager", description: "Church manager management" },
      { name: "Treasurer", description: "Treasurer management" },
      { name: "Offer", description: "Base offer management" },
      { name: "SpecialOffer", description: "Special offer management" },
      { name: "Tithe", description: "Tithe management" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Resource not found",
            },
          },
        },
        SessionRequest: {
          type: "object",
          required: ["login", "password"],
          properties: {
            login: { type: "string", example: "maria.silva" },
            password: { type: "string", example: "senha-segura-123" },
          },
        },
        AuthenticatedUser: {
          type: "object",
          properties: {
            id: { type: "number", example: 1 },
            login: { type: "string", example: "maria.silva" },
          },
        },
        AuthenticatedMember: {
          type: "object",
          properties: {
            id: { type: "number", example: 12 },
            name: { type: "string", example: "Maria da Silva" },
            birth_date: {
              type: "string",
              format: "date-time",
              example: "1990-05-20T00:00:00.000Z",
            },
            batism_date: {
              type: "string",
              format: "date-time",
              example: "2008-04-10T00:00:00.000Z",
            },
            ecclesiasticalRole: { type: "string", example: "Member" },
            cpf: { type: "string", example: "12345678901" },
            rg: { type: "number", example: 123456789 },
            email: { type: "string", format: "email", example: "maria@email.com" },
            foto: { type: "string", nullable: true, example: null },
            id_church: { type: "number", example: 1 },
          },
        },
        SessionResponse: {
          type: "object",
          properties: {
            token: { type: "string", example: "jwt.token.value" },
            user: { $ref: "#/components/schemas/AuthenticatedUser" },
            member: {
              type: "object",
              properties: {
                id: { type: "number", example: 12 },
                name: { type: "string", example: "Maria da Silva" },
                email: {
                  type: "string",
                  format: "email",
                  example: "maria@email.com",
                },
                ecclesiasticalRole: { type: "string", example: "Member" },
                id_church: { type: "number", example: 1 },
              },
            },
          },
        },
        MeResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/AuthenticatedUser" },
            member: { $ref: "#/components/schemas/AuthenticatedMember" },
          },
        },
        LocationInput: {
          type: "object",
          required: ["street", "district", "city", "state", "country", "cep"],
          properties: {
            street: { type: "string", example: "Rua das Flores" },
            district: { type: "string", example: "Centro" },
            city: { type: "string", example: "Sao Paulo" },
            state: { type: "string", example: "SP" },
            country: { type: "string", example: "Brasil" },
            cep: {
              type: "string",
              example: "01001000",
              description: "CEP represented as string to preserve leading zeros.",
            },
          },
        },
        ChurchCreateRequest: {
          allOf: [
            { $ref: "#/components/schemas/LocationInput" },
            {
              type: "object",
              required: ["date"],
              properties: {
                date: {
                  type: "string",
                  format: "date",
                  example: "2024-01-15",
                },
                type: {
                  type: "string",
                  enum: ["HEADQUARTER", "BRANCH"],
                  example: "BRANCH",
                  description:
                    "Optional. The first church created becomes HEADQUARTER automatically.",
                },
              },
            },
          ],
        },
        MemberCreateRequest: {
          type: "object",
          required: [
            "id_church",
            "name",
            "birth_date",
            "batism_date",
            "ecclesiasticalRole",
            "cpf",
            "rg",
            "login",
            "email",
            "password",
          ],
          properties: {
            id_church: { type: "number", example: 1 },
            name: { type: "string", example: "Maria da Silva" },
            birth_date: {
              type: "string",
              format: "date",
              example: "1990-05-20",
            },
            batism_date: {
              type: "string",
              format: "date",
              example: "2008-04-10",
            },
            ecclesiasticalRole: { type: "string", example: "Member" },
            cpf: {
              type: "string",
              example: "12345678901",
              description: "CPF represented as string for JSON compatibility.",
            },
            rg: { type: "number", example: 123456789 },
            login: { type: "string", example: "maria.silva" },
            email: { type: "string", format: "email", example: "maria@email.com" },
            password: { type: "string", example: "senha-inicial" },
          },
        },
        MemberUpdateRequest: {
          type: "object",
          required: [
            "id_church",
            "name",
            "birth_date",
            "batism_date",
            "ecclesiasticalRole",
            "cpf",
            "rg",
            "email",
          ],
          properties: {
            id_church: { type: "number", example: 1 },
            name: { type: "string", example: "Maria da Silva" },
            birth_date: {
              type: "string",
              format: "date",
              example: "1990-05-20",
            },
            batism_date: {
              type: "string",
              format: "date",
              example: "2008-04-10",
            },
            ecclesiasticalRole: { type: "string", example: "Member" },
            cpf: {
              type: "string",
              example: "12345678901",
              description: "CPF represented as string for JSON compatibility.",
            },
            rg: { type: "number", example: 123456789 },
            email: { type: "string", format: "email", example: "maria@email.com" },
          },
        },
        UserLoginUpdateRequest: {
          type: "object",
          required: ["login"],
          properties: {
            login: { type: "string", example: "maria.silva" },
          },
        },
        UserPasswordUpdateRequest: {
          type: "object",
          required: ["password"],
          properties: {
            password: {
              type: "string",
              minLength: 8,
              example: "senha-segura-123",
            },
          },
        },
        ManagerRequest: {
          type: "object",
          required: ["id_member", "id_church"],
          properties: {
            id_member: { type: "number", example: 1 },
            id_church: { type: "number", example: 1 },
          },
        },
        CultRequest: {
          type: "object",
          required: ["date", "theme", "id_church"],
          properties: {
            date: {
              type: "string",
              format: "date",
              example: "2025-05-22",
            },
            theme: { type: "string", example: "Culto de ensino" },
            id_church: { type: "number", example: 1 },
          },
        },
        CostCreateRequest: {
          type: "object",
          required: ["value", "date", "description", "id_church"],
          properties: {
            value: { type: "number", example: 350.5 },
            date: {
              type: "string",
              format: "date",
              example: "2025-05-22",
            },
            description: { type: "string", example: "Conta de energia" },
            id_church: { type: "number", example: 1 },
          },
        },
        CostUpdateRequest: {
          type: "object",
          required: ["value", "date", "description"],
          properties: {
            value: { type: "number", example: 350.5 },
            date: {
              type: "string",
              format: "date",
              example: "2025-05-22",
            },
            description: { type: "string", example: "Conta de energia ajustada" },
          },
        },
        TreasurerCreateRequest: {
          type: "object",
          description: "Treasurer creation uses the member id from the route parameter.",
          properties: {},
        },
        TreasurerUpdateRequest: {
          type: "object",
          required: ["id_member"],
          properties: {
            id_member: { type: "number", example: 2 },
          },
        },
        OfferRequest: {
          type: "object",
          required: ["id_treasurer", "value"],
          properties: {
            id_treasurer: { type: "number", example: 3 },
            value: { type: "number", example: 125 },
          },
        },
        SpecialOfferRequest: {
          type: "object",
          required: [
            "id_church",
            "id_member",
            "id_treasurer",
            "value",
            "reason",
            "date",
          ],
          properties: {
            id_church: { type: "number", example: 1 },
            id_member: { type: "number", example: 12 },
            id_treasurer: { type: "number", example: 3 },
            value: { type: "number", example: 150 },
            reason: { type: "string", example: "Campanha missionaria" },
            date: {
              type: "string",
              format: "date",
              example: "2025-02-10",
            },
          },
        },
        TitheRequest: {
          type: "object",
          required: [
            "id_church",
            "id_member",
            "id_treasurer",
            "value",
            "reason",
            "date",
            "month",
            "year",
          ],
          properties: {
            id_church: { type: "number", example: 1 },
            id_member: { type: "number", example: 12 },
            id_treasurer: { type: "number", example: 3 },
            value: { type: "number", example: 200 },
            reason: { type: "string", example: "Dizimo referente a maio" },
            date: {
              type: "string",
              format: "date",
              example: "2025-05-22",
            },
            month: { type: "number", example: 5 },
            year: { type: "number", example: 2025 },
          },
        },
      },
    },
  },
  apis: [
    path.resolve(__dirname, "../../../modules/**/infra/http/routes/*.{ts,js}"),
    path.resolve(__dirname, "../../modules/**/infra/http/routes/*.{ts,js}"),
    path.resolve(__dirname, "../http/routes/*.{ts,js}"),
  ],
};

const specs = swaggerJsdoc(options);

module.exports = { specs };
