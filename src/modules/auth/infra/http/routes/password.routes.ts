import { Router } from "express";
import asyncHandler from "../../../../../shared/infra/http/utils/asyncHandler";
import PasswordController from "../controllers/PasswordController";

const passwordRouter = Router();
const passwordController = new PasswordController();

/**
 * @openapi
 * /password/forgot:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Request a password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset token requested
 *
 * /password/reset:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset a password with a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */
passwordRouter.post(
  "/password/forgot",
  asyncHandler(passwordController.forgot.bind(passwordController))
);
passwordRouter.post(
  "/password/reset",
  asyncHandler(passwordController.reset.bind(passwordController))
);

export default passwordRouter;
