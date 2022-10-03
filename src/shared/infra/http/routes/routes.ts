import { Router } from "express";
import churchRouter from "../../../../modules/churchs/infra/http/routes/church.routes";
import managerRouter from "../../../../modules/manager/infra/http/routes/manager.routes";
import memberRouter from "../../../../modules/members/infra/http/routes/member.routes";
import treasurerRouter from "../../../../modules/treasurer/infra/http/routes/treasurer.routes";

const routes = Router();

routes.use("/member", memberRouter);
routes.use("/church", churchRouter);
routes.use("/manager", managerRouter);
routes.use("/treasurer", treasurerRouter);

export default routes;