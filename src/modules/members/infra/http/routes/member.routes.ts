import { Router } from "express";
import ensureChurchScope from "../../../../../shared/infra/http/middlewares/ensureChurchScope";
import ensureAuthenticated from "../../../../../shared/infra/http/middlewares/ensureAuthenticated";
import ensureScopedResourceAccess from "../../../../../shared/infra/http/middlewares/ensureScopedResourceAccess";
import ensureSystemAccess from "../../../../../shared/infra/http/middlewares/ensureSystemAccess";
import asyncHandler from "../../../../../shared/infra/http/utils/asyncHandler";
import MemberController from "../controllers/MemberController";
import MemberInChurchController from "../controllers/MemberInChurchController";

const memberRouter = Router();
const memberController = new MemberController();
const memberInChurchController = new MemberInChurchController();

/**
 * @openapi
 * /member:
 *   get:
 *     tags:
 *       - Member
 *     summary: List members
 *     responses:
 *       200:
 *         description: Member list
 *   post:
 *     tags:
 *       - Member
 *     summary: Create a member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberCreateRequest'
 *     responses:
 *       200:
 *         description: Member created
 *       401:
 *         description: Validation or business error
 *
 * /member/{id}:
 *   get:
 *     tags:
 *       - Member
 *     summary: List members by church
 *     description: Returns the members linked to a church id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Members from the given church
 *       401:
 *         description: Validation or business error
 *   put:
 *     tags:
 *       - Member
 *     summary: Update a member
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
 *             $ref: '#/components/schemas/MemberUpdateRequest'
 *     responses:
 *       200:
 *         description: Member updated
 *       401:
 *         description: Validation or business error
 *   delete:
 *     tags:
 *       - Member
 *     summary: Delete a member
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Member deleted
 *       401:
 *         description: Validation or business error
 */
memberRouter.get(
  "/",
  ensureAuthenticated,
  ensureSystemAccess("viewer"),
  asyncHandler(memberController.index.bind(memberController))
);
memberRouter.post(
  "/",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureChurchScope({ source: "body", field: "id_church" }),
  asyncHandler(memberController.create.bind(memberController))
);
memberRouter.put(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureScopedResourceAccess("member"),
  ensureChurchScope({ source: "body", field: "id_church" }),
  asyncHandler(memberController.update.bind(memberController))
);
memberRouter.get(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("viewer"),
  ensureChurchScope({ source: "params", field: "id" }),
  asyncHandler(memberInChurchController.index.bind(memberInChurchController))
);
memberRouter.delete(
  "/:id",
  ensureAuthenticated,
  ensureSystemAccess("editor"),
  ensureScopedResourceAccess("member"),
  asyncHandler(memberController.delete.bind(memberController))
);

export default memberRouter;
