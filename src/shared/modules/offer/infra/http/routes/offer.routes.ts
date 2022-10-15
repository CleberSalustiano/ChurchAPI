import { Router } from "express";
import OfferController from "../controller/OfferController";

const offerRouter = Router();
const offerController = new OfferController();

offerRouter.get("/", offerController.index);
offerRouter.post("/", offerController.create);
offerRouter.put("/:id", offerController.update);
offerRouter.delete("/:id", offerController.delete);

export default offerRouter;
