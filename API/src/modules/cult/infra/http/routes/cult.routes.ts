import { Router } from "express";
import ensureChurchScope from "../../../../../shared/infra/http/middlewares/ensureChurchScope";
import ensureAuthenticated from "../../../../../shared/infra/http/middlewares/ensureAuthenticated";
import ensureScopedResourceAccess from "../../../../../shared/infra/http/middlewares/ensureScopedResourceAccess";
import ensureSystemAccess from "../../../../../shared/infra/http/middlewares/ensureSystemAccess";
import asyncHandler from "../../../../../shared/infra/http/utils/asyncHandler";
import CultController from "../controllers/CultController";

const cultRouter = Router();
const cultController = new CultController();

/**
 * @openapi
 * /cult:
 *   get:
 *     tags:
 *       - Cult
 *     summary: List cults
 *     responses:
 *       200:
 *         description: Cult list
 *   post:
 *     tags:
 *       - Cult
 *     summary: Create a cult
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CultRequest'
 *     responses:
 *       200:
 *         description: Cult created
 *
 * /cult/{id}:
 *   put:
 *     tags:
 *       - Cult
 *     summary: Update a cult
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
 *             $ref: '#/components/schemas/CultRequest'
 *     responses:
 *       200:
 *         description: Cult updated
 *   delete:
 *     tags:
 *       - Cult
 *     summary: Delete a cult
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Cult deleted
 *
 * /cult/recurring:
 *   post:
 *     tags:
 *       - Cult
 *     summary: Create a recurring weekly cult series
 *     responses:
 *       200:
 *         description: Cult series created
 *
 * /cult/{id}/series:
 *   put:
 *     tags:
 *       - Cult
 *     summary: Update future cults from the same recurring series
 *     responses:
 *       200:
 *         description: Cult series updated
 *
 * /cult/{id}/offers:
 *   post:
 *     tags:
 *       - Cult
 *     summary: Register an offer collected in a cult
 *     responses:
 *       200:
 *         description: Cult offer created
 *
 * /cult/{id}/offers/{cultOfferId}:
 *   put:
 *     tags:
 *       - Cult
 *     summary: Update an offer collected in a cult
 *     responses:
 *       200:
 *         description: Cult offer updated
 *   delete:
 *     tags:
 *       - Cult
 *     summary: Inactivate an offer collected in a cult
 *     responses:
 *       200:
 *         description: Cult offer inactivated
 */
cultRouter.get(
  "/",
  ensureAuthenticated,
  ensureSystemAccess("viewer"),
  asyncHandler(cultController.index.bind(cultController))
);
cultRouter.post(
  "/",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureChurchScope({ source: "body", field: "id_church" }),
  asyncHandler(cultController.create.bind(cultController))
);
cultRouter.post(
  "/recurring",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureChurchScope({ source: "body", field: "id_church" }),
  asyncHandler(cultController.createRecurring.bind(cultController))
);
cultRouter.put(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureScopedResourceAccess("cult"),
  ensureChurchScope({ source: "body", field: "id_church" }),
  asyncHandler(cultController.update.bind(cultController))
);
cultRouter.put(
  "/:id/series",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureScopedResourceAccess("cult"),
  ensureChurchScope({ source: "body", field: "id_church" }),
  asyncHandler(cultController.updateSeries.bind(cultController))
);
cultRouter.delete(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureScopedResourceAccess("cult"),
  asyncHandler(cultController.delete.bind(cultController))
);
cultRouter.post(
  "/:id/offers",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureScopedResourceAccess("cult"),
  asyncHandler(cultController.createOffer.bind(cultController))
);
cultRouter.put(
  "/:id/offers/:cultOfferId",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureScopedResourceAccess("cult"),
  asyncHandler(cultController.updateOffer.bind(cultController))
);
cultRouter.delete(
  "/:id/offers/:cultOfferId",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureScopedResourceAccess("cult"),
  asyncHandler(cultController.deleteOffer.bind(cultController))
);

export default cultRouter;
