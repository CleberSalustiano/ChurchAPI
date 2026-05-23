import { Router } from "express";
import ensureAuthenticated from "../../../../../shared/infra/http/middlewares/ensureAuthenticated";
import ensureSystemAccess from "../../../../../shared/infra/http/middlewares/ensureSystemAccess";
import asyncHandler from "../../../../../shared/infra/http/utils/asyncHandler";
import TreasurerController from "../controllers/TreasurerController";

const treasurerRouter = Router();
const treasurerController = new TreasurerController();

/**
 * @openapi
 * /treasurer:
 *   get:
 *     tags:
 *       - Treasurer
 *     summary: List active treasurers
 *     responses:
 *       200:
 *         description: Treasurer list
 *
 * /treasurer/{id}:
 *   post:
 *     tags:
 *       - Treasurer
 *     summary: Create a treasurer assignment for a member
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Member id
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TreasurerCreateRequest'
 *     responses:
 *       200:
 *         description: Treasurer created
 *       401:
 *         description: Validation or business error
 *   put:
 *     tags:
 *       - Treasurer
 *     summary: Update a treasurer assignment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Treasurer id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TreasurerUpdateRequest'
 *     responses:
 *       200:
 *         description: Treasurer updated
 *       401:
 *         description: Validation or business error
 *   delete:
 *     tags:
 *       - Treasurer
 *     summary: Deactivate a treasurer assignment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Treasurer id
 *     responses:
 *       201:
 *         description: Treasurer deactivated
 *       401:
 *         description: Validation or business error
 */
treasurerRouter.post(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  asyncHandler(treasurerController.create.bind(treasurerController))
);
treasurerRouter.get(
  "/",
  ensureAuthenticated,
  ensureSystemAccess("viewer"),
  asyncHandler(treasurerController.index.bind(treasurerController))
);
treasurerRouter.put(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  asyncHandler(treasurerController.update.bind(treasurerController))
);
treasurerRouter.delete(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  asyncHandler(treasurerController.delete.bind(treasurerController))
);

export default treasurerRouter;
