import { Router } from "express";
import ensureChurchScope from "../../../../../shared/infra/http/middlewares/ensureChurchScope";
import ensureAuthenticated from "../../../../../shared/infra/http/middlewares/ensureAuthenticated";
import ensureScopedResourceAccess from "../../../../../shared/infra/http/middlewares/ensureScopedResourceAccess";
import ensureSystemAccess from "../../../../../shared/infra/http/middlewares/ensureSystemAccess";
import asyncHandler from "../../../../../shared/infra/http/utils/asyncHandler";
import TitheController from "../controllers/TitheController";

const titheRouter = Router();
const titheController = new TitheController();

/**
 * @openapi
 * /tithe:
 *   get:
 *     tags:
 *       - Tithe
 *     summary: List tithes
 *     responses:
 *       200:
 *         description: Tithe list
 *   post:
 *     tags:
 *       - Tithe
 *     summary: Create a tithe entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TitheRequest'
 *     responses:
 *       200:
 *         description: Tithe created
 *
 * /tithe/{id}:
 *   put:
 *     tags:
 *       - Tithe
 *     summary: Update a tithe entry
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
 *             $ref: '#/components/schemas/TitheRequest'
 *     responses:
 *       200:
 *         description: Tithe updated
 *   delete:
 *     tags:
 *       - Tithe
 *     summary: Delete a tithe entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Tithe deleted
 */
titheRouter.get(
  "/",
  ensureAuthenticated,
  ensureSystemAccess("viewer"),
  asyncHandler(titheController.index.bind(titheController))
);
titheRouter.post(
  "/",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureChurchScope({ source: "body", field: "id_church" }),
  asyncHandler(titheController.create.bind(titheController))
);
titheRouter.put(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureChurchScope({ source: "body", field: "id_church" }),
  asyncHandler(titheController.update.bind(titheController))
);
titheRouter.delete(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureScopedResourceAccess("tithe", "id", "params"),
  asyncHandler(titheController.delete.bind(titheController))
);

export default titheRouter;
