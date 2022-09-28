import { Router } from "express";
import MemberController from "../controllers/MemberController";
import MemberInChurchController from "../controllers/MemberInChurchController";

const memberRouter = Router();
const memberController = new MemberController();
const memberInChurchController = new MemberInChurchController();

memberRouter.get("/", memberController.index);
memberRouter.post("/", memberController.create);
memberRouter.put("/:id", memberController.update);
memberRouter.get("/:id", memberInChurchController.index)

export default memberRouter;
