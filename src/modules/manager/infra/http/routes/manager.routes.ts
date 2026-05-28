import { Router } from "express";
import ensureChurchScope from "../../../../../shared/infra/http/middlewares/ensureChurchScope";
import ensureAuthenticated from "../../../../../shared/infra/http/middlewares/ensureAuthenticated";
import ensureScopedResourceAccess from "../../../../../shared/infra/http/middlewares/ensureScopedResourceAccess";
import ensureSystemAccess from "../../../../../shared/infra/http/middlewares/ensureSystemAccess";
import asyncHandler from "../../../../../shared/infra/http/utils/asyncHandler";
import ManagerController from "../controllers/ManagerController";
import ManagerInChurchController from "../controllers/ManagerInChurchController";

const managerRouter = Router();
const managerController = new ManagerController();
const managerInChurchController = new ManagerInChurchController();

/**
 * @openapi
 * /manager:
 *   get:
 *     tags:
 *       - Manager
 *     summary: List active managers
 *     responses:
 *       200:
 *         description: Manager list
 *   post:
 *     tags:
 *       - Manager
 *     summary: Create a manager assignment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ManagerRequest'
 *     responses:
 *       200:
 *         description: Manager created
 *       401:
 *         description: Validation or business error
 *
 * /manager/{id}:
 *   get:
 *     tags:
 *       - Manager
 *     summary: List managers by church
 *     description: Returns active managers linked to a church id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Managers from the given church
 *       401:
 *         description: Validation or business error
 *   put:
 *     tags:
 *       - Manager
 *     summary: Update a manager assignment
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
 *             $ref: '#/components/schemas/ManagerRequest'
 *     responses:
 *       200:
 *         description: Manager updated
 *       401:
 *         description: Validation or business error
 *   delete:
 *     tags:
 *       - Manager
 *     summary: Deactivate a manager assignment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Manager deactivated
 *       401:
 *         description: Validation or business error
 */
managerRouter.post(
  "/",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureChurchScope({ source: "body", field: "id_church" }),
  asyncHandler(managerController.create.bind(managerController))
);
managerRouter.put(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureScopedResourceAccess("manager"),
  ensureChurchScope({ source: "body", field: "id_church" }),
  asyncHandler(managerController.update.bind(managerController))
);
managerRouter.get(
  "/",
  ensureAuthenticated,
  ensureSystemAccess("viewer"),
  asyncHandler(managerController.index.bind(managerController))
);
managerRouter.get(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("viewer"),
  ensureChurchScope({ source: "params", field: "id" }),
  asyncHandler(managerInChurchController.index.bind(managerInChurchController))
);
managerRouter.delete(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureScopedResourceAccess("manager"),
  asyncHandler(managerController.delete.bind(managerController))
);

export default managerRouter;
