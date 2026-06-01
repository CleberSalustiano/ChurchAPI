import { Router } from "express";
import ensureAuthenticated from "../../../../../shared/infra/http/middlewares/ensureAuthenticated";
import ensureGlobalSystemAccess from "../../../../../shared/infra/http/middlewares/ensureGlobalSystemAccess";
import ensureSystemAccess from "../../../../../shared/infra/http/middlewares/ensureSystemAccess";
import asyncHandler from "../../../../../shared/infra/http/utils/asyncHandler";
import ChurchController from "../controllers/ChurchController";

const churchRouter = Router();

const churchController = new ChurchController();

/**
 * @openapi
 * /church:
 *   post:
 *     tags:
 *       - Church
 *     summary: Create a church
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChurchCreateRequest'
 *     responses:
 *       200:
 *         description: Church created
 *       400:
 *         description: Validation or business error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /church/structured:
 *   post:
 *     tags:
 *       - Church
 *     summary: Create a church with its initial manager and member credentials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChurchStructuredCreateRequest'
 *     responses:
 *       200:
 *         description: Church, member and manager created atomically
 *       400:
 *         description: Validation or business error
 *
 * /church/bootstrap:
 *   post:
 *     tags:
 *       - Church
 *     summary: Bootstrap the first headquarter with its initial manager
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChurchStructuredCreateRequest'
 *     responses:
 *       200:
 *         description: First headquarter created successfully
 *       400:
 *         description: Validation or business error
 *   get:
 *     tags:
 *       - Church
 *     summary: List churches
 *     responses:
 *       200:
 *         description: Church list
 *
 * /church/{id_church}:
 *   put:
 *     tags:
 *       - Church
 *     summary: Update a church
 *     parameters:
 *       - in: path
 *         name: id_church
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChurchCreateRequest'
 *     responses:
 *       200:
 *         description: Church updated
 *       400:
 *         description: Validation or business error
 *   delete:
 *     tags:
 *       - Church
 *     summary: Delete a church
 *     parameters:
 *       - in: path
 *         name: id_church
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Church logically deleted
 *       400:
 *         description: Validation or business error
 *
 * /church/{id_church}/deactivate:
 *   patch:
 *     tags:
 *       - Church
 *     summary: Deactivate a branch
 *     parameters:
 *       - in: path
 *         name: id_church
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Branch deactivated
 *       400:
 *         description: Validation or business error
 *
 * /church/{id_church}/reactivate:
 *   patch:
 *     tags:
 *       - Church
 *     summary: Reactivate a branch
 *     parameters:
 *       - in: path
 *         name: id_church
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Branch reactivated
 *       400:
 *         description: Validation or business error
 */
churchRouter.post(
  "/",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureGlobalSystemAccess,
  asyncHandler(churchController.create.bind(churchController))
);
churchRouter.post(
  "/structured",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureGlobalSystemAccess,
  asyncHandler(churchController.createStructured.bind(churchController))
);
churchRouter.post(
  "/bootstrap",
  asyncHandler(churchController.createStructured.bind(churchController))
);
churchRouter.get(
  "/",
  ensureAuthenticated,
  ensureSystemAccess("viewer"),
  asyncHandler(churchController.index.bind(churchController))
);
churchRouter.delete(
  "/:id_church",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureGlobalSystemAccess,
  asyncHandler(churchController.delete.bind(churchController))
);
churchRouter.patch(
  "/:id_church/deactivate",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureGlobalSystemAccess,
  asyncHandler(churchController.deactivate.bind(churchController))
);
churchRouter.patch(
  "/:id_church/reactivate",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureGlobalSystemAccess,
  asyncHandler(churchController.reactivate.bind(churchController))
);
churchRouter.put(
  "/:id_church",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureGlobalSystemAccess,
  asyncHandler(churchController.update.bind(churchController))
);

export default churchRouter;
