const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Seu API com Swagger",
      version: "1.0.0",
    },
  },
  apis: ["./../../../modules/**/*.routes.ts", "./../http/routes/routes.ts"], // Adapte o padrão de acordo com sua estrutura
};

const specs = swaggerJsdoc(options);

module.exports = { specs };
