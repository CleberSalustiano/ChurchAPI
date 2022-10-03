import { Router } from "express";
import TreasurerController from "../controllers/TreasurerController";

const treasurerRouter = Router();
const treasurerController = new TreasurerController();

treasurerRouter.post("/:id", treasurerController.create);
treasurerRouter.get("/", treasurerController.index)

export default treasurerRouter;

