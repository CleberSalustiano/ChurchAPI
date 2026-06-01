import { Router } from "express";
import ensureChurchScope from "../../../../../shared/infra/http/middlewares/ensureChurchScope";
import ensureAuthenticated from "../../../../../shared/infra/http/middlewares/ensureAuthenticated";
import ensureScopedResourceAccess from "../../../../../shared/infra/http/middlewares/ensureScopedResourceAccess";
import ensureSystemAccess from "../../../../../shared/infra/http/middlewares/ensureSystemAccess";
import asyncHandler from "../../../../../shared/infra/http/utils/asyncHandler";
import SpecialOfferController from "../controllers/SpecialOfferController";

const specialOfferRouter = Router();
const specialOfferController = new SpecialOfferController(); 

/**
 * @openapi
 * /specialOffer:
 *   get:
 *     tags:
 *       - SpecialOffer
 *     summary: List special offers
 *     responses:
 *       200:
 *         description: Special offer list
 *   post:
 *     tags:
 *       - SpecialOffer
 *     summary: Create a special offer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpecialOfferRequest'
 *     responses:
 *       200:
 *         description: Special offer created
 *       401:
 *         description: Validation or business error
 */
specialOfferRouter.post(
  "/",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureScopedResourceAccess("member", "id_member", "body"),
  ensureScopedResourceAccess("treasurer", "id_treasurer", "body"),
  ensureChurchScope({ source: "body", field: "id_church" }),
  asyncHandler(specialOfferController.create.bind(specialOfferController))
);
specialOfferRouter.get(
  "/",
  ensureAuthenticated,
  ensureSystemAccess("viewer"),
  asyncHandler(specialOfferController.index.bind(specialOfferController))
);

export default specialOfferRouter;
