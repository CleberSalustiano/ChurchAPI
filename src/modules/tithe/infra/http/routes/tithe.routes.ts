import { Router } from "express";
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
titheRouter.get("/", asyncHandler(titheController.index.bind(titheController)));
titheRouter.post("/", asyncHandler(titheController.create.bind(titheController)));
titheRouter.put("/:id", asyncHandler(titheController.update.bind(titheController)));
titheRouter.delete("/:id", asyncHandler(titheController.delete.bind(titheController)));

export default titheRouter;
