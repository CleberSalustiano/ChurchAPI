import { Router } from "express";
import churchRouter from "../../../../modules/churchs/infra/http/routes/church.routes";
import memberRouter from "../../../../modules/members/infra/http/routes/member.routes";

const routes = Router();

routes.use("/member", memberRouter);
routes.use("/church", churchRouter);

export default routes;