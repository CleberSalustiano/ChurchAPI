import { Router } from "express";
import ensureAuthenticated from "../../../../../shared/infra/http/middlewares/ensureAuthenticated";
import asyncHandler from "../../../../../shared/infra/http/utils/asyncHandler";
import SessionController from "../controllers/SessionController";

const sessionRouter = Router();
const sessionController = new SessionController();

/**
 * @openapi
 * /session:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Authenticate a user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SessionRequest'
 *     responses:
 *       200:
 *         description: Authenticated session
 *       401:
 *         description: Invalid credentials
 *
 * /me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get authenticated user profile
 *     responses:
 *       200:
 *         description: Authenticated user profile
 *       401:
 *         description: Missing or invalid token
 */
sessionRouter.post(
  "/session",
  asyncHandler(sessionController.create.bind(sessionController))
);
sessionRouter.get(
  "/me",
  ensureAuthenticated,
  asyncHandler(sessionController.show.bind(sessionController))
);

export default sessionRouter;
