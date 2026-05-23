import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import AppError from "../../errors/AppError";
import { resolveCorsOptions } from "./config/cors";
import errorHandler from "./middlewares/errorHandler";
import routes from "./routes/routes";
import swaggerUi from "swagger-ui-express";

const { specs } = require("../swagger");

const app = express();

app.use(cors(resolveCorsOptions()));
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(routes);

app.use((_request: Request, _response: Response, next: NextFunction) => {
  next(new AppError("Route not found", 404));
});

app.use(errorHandler);

export default app;
