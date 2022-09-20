import { Router } from "express";
import ChurchController from "../controllers/ChurchController";

const churchRouter = Router();

const churchController = new ChurchController();
churchRouter.post("/", churchController.create)

export default churchRouter;