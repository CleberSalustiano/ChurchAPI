import { Router } from "express";
import churchRouter from "../../../../modules/churches/infra/http/routes/church.routes";
import costRouter from "../../../../modules/cost/infra/http/routes/cost.routes";
import cultRouter from "../../../../modules/cult/infra/http/routes/cult.routes";
import managerRouter from "../../../../modules/manager/infra/http/routes/manager.routes";
import memberRouter from "../../../../modules/members/infra/http/routes/member.routes";
import specialOfferRouter from "../../../../modules/specialOffer/infra/http/routes/specialOffer.routes";
import titheRouter from "../../../../modules/tithe/infra/http/routes/tithe.routes";
import treasurerRouter from "../../../../modules/treasurer/infra/http/routes/treasurer.routes";
import offerRouter from "../../../modules/offer/infra/http/routes/offer.routes";
import systemRouter from "./system.routes";

const routes = Router();

routes.use(systemRouter);
routes.use("/member", memberRouter);
routes.use("/church", churchRouter);
routes.use("/cult", cultRouter);
routes.use("/cost", costRouter);
routes.use("/manager", managerRouter);
routes.use("/treasurer", treasurerRouter);
routes.use("/offer", offerRouter);
routes.use("/specialOffer", specialOfferRouter);
routes.use("/tithe", titheRouter);

export default routes;
