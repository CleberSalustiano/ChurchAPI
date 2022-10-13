import { Router } from "express";
import ManagerController from "../controllers/ManagerController";
import ManagerInChurchController from "../controllers/ManagerInChurchController";

const managerRouter = Router();
const managerController = new ManagerController();
const managerInChurchController = new ManagerInChurchController();

managerRouter.post("/", managerController.create);
managerRouter.put("/:id", managerController.update);
managerRouter.get("/", managerController.index);
managerRouter.get("/:id", managerInChurchController.index);
managerRouter.delete("/:id", managerController.delete)

export default managerRouter;
