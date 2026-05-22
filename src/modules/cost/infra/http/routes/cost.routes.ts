import { Router } from "express";
import asyncHandler from "../../../../../shared/infra/http/utils/asyncHandler";
import CostController from "../controllers/CostController";

const costRouter = Router();
const costController = new CostController();

/**
 * @openapi
 * /cost:
 *   get:
 *     tags:
 *       - Cost
 *     summary: List costs
 *     responses:
 *       200:
 *         description: Cost list
 *   post:
 *     tags:
 *       - Cost
 *     summary: Create a cost entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CostCreateRequest'
 *     responses:
 *       200:
 *         description: Cost created
 *
 * /cost/{id}:
 *   put:
 *     tags:
 *       - Cost
 *     summary: Update a cost entry
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
 *             $ref: '#/components/schemas/CostUpdateRequest'
 *     responses:
 *       200:
 *         description: Cost updated
 *   delete:
 *     tags:
 *       - Cost
 *     summary: Delete a cost entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Cost deleted
 */
costRouter.get("/", asyncHandler(costController.index.bind(costController)));
costRouter.post("/", asyncHandler(costController.create.bind(costController)));
costRouter.put("/:id", asyncHandler(costController.update.bind(costController)));
costRouter.delete("/:id", asyncHandler(costController.delete.bind(costController)));

export default costRouter;
