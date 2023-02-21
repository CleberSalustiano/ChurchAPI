import { Router } from "express";
import SpecialOfferController from "../controllers/SpecialOfferController";

const specialOfferRouter = Router();
const specialOfferController = new SpecialOfferController(); 

specialOfferRouter.post("/", specialOfferController.create);
specialOfferRouter.get("/", specialOfferController.index);

export default specialOfferRouter;