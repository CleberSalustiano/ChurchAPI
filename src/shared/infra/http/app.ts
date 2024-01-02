import express from "express";
import routes from "./routes/routes";
import swaggerUi from 'swagger-ui-express';
const {specs} = require("../swagger")

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(routes);

app.listen(3333, () => console.log("Server is on PORT 3333"));
