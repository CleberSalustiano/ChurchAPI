import { Router } from "express";
import ensureAuthenticated from "../../../../../infra/http/middlewares/ensureAuthenticated";
import ensureScopedResourceAccess from "../../../../../infra/http/middlewares/ensureScopedResourceAccess";
import ensureSystemAccess from "../../../../../infra/http/middlewares/ensureSystemAccess";
import asyncHandler from "../../../../../infra/http/utils/asyncHandler";
import OfferController from "../controller/OfferController";

const offerRouter = Router();
const offerController = new OfferController();

/**
 * @openapi
 * /offer:
 *   get:
 *     tags:
 *       - Offer
 *     summary: List raw offers
 *     description: Base financial offer records used by other modules such as special offers and tithes.
 *     responses:
 *       200:
 *         description: Offer list
 *   post:
 *     tags:
 *       - Offer
 *     summary: Create a raw offer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfferRequest'
 *     responses:
 *       200:
 *         description: Offer created
 *
 * /offer/{id}:
 *   put:
 *     tags:
 *       - Offer
 *     summary: Update a raw offer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfferRequest'
 *     responses:
 *       200:
 *         description: Offer updated
 *   delete:
 *     tags:
 *       - Offer
 *     summary: Delete a raw offer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Offer deleted
 */
offerRouter.get(
  "/",
  ensureAuthenticated,
  ensureSystemAccess("viewer"),
  asyncHandler(offerController.index.bind(offerController))
);
offerRouter.post(
  "/",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureScopedResourceAccess("treasurer", "id_treasurer", "body"),
  asyncHandler(offerController.create.bind(offerController))
);
offerRouter.put(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureScopedResourceAccess("offer", "id", "params"),
  ensureScopedResourceAccess("treasurer", "id_treasurer", "body"),
  asyncHandler(offerController.update.bind(offerController))
);
offerRouter.delete(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureScopedResourceAccess("offer", "id", "params"),
  asyncHandler(offerController.delete.bind(offerController))
);

export default offerRouter;
