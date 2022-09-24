import { Router } from "express";
import MemberController from "../controllers/MemberController";

const memberRouter = Router();
const memberController = new MemberController();

memberRouter.get("/", memberController.create)

export default memberRouter;