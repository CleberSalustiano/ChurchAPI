import { Router } from "express";
import ChurchController from "../controllers/ChurchController";

const churchRouter = Router();

const churchController = new ChurchController();
churchRouter.post("/", churchController.create)
churchRouter.get("/", churchController.index)
churchRouter.delete("/:id_church", churchController.delete)
churchRouter.put("/:id_church", churchController.update)

export default churchRouter;