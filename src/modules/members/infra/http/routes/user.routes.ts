import { Router } from "express";
import asyncHandler from "../../../../../shared/infra/http/utils/asyncHandler";
import UserCredentialsController from "../controllers/UserCredentialsController";

const userRouter = Router();
const userCredentialsController = new UserCredentialsController();

/**
 * @openapi
 * /user/{id}/login:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update a user login
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
 *             $ref: '#/components/schemas/UserLoginUpdateRequest'
 *     responses:
 *       200:
 *         description: User login updated
 *       400:
 *         description: Validation or business error
 *
 * /user/{id}/password:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update a user password
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
 *             $ref: '#/components/schemas/UserPasswordUpdateRequest'
 *     responses:
 *       200:
 *         description: User password updated
 *       400:
 *         description: Validation or business error
 */
userRouter.patch(
  "/:id/login",
  asyncHandler(userCredentialsController.updateLogin.bind(userCredentialsController))
);
userRouter.patch(
  "/:id/password",
  asyncHandler(
    userCredentialsController.updatePassword.bind(userCredentialsController)
  )
);

export default userRouter;
