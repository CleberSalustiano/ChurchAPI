import { Router } from "express";
import ensureChurchScope from "../../../../../shared/infra/http/middlewares/ensureChurchScope";
import ensureAuthenticated from "../../../../../shared/infra/http/middlewares/ensureAuthenticated";
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
cultRouter.put(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureChurchScope({ source: "body", field: "id_church" }),
  asyncHandler(cultController.update.bind(cultController))
);
cultRouter.delete(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  asyncHandler(cultController.delete.bind(cultController))
);

export default cultRouter;
