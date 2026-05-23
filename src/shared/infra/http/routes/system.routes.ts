import { Router } from "express";
import asyncHandler from "../utils/asyncHandler";

const systemRouter = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - System
 *     summary: Check API health
 *     description: Returns a simple status response so containers and external clients can verify the API is running.
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
systemRouter.get(
  "/health",
  asyncHandler(async (_request, response) => {
    return response.status(200).json({ status: "ok" });
  })
);

export default systemRouter;
