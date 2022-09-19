import { Router } from "express";
import memberRouter from "./member.routes";

const routes = Router();

routes.use("/member", memberRouter);

export default routes;