import { NextFunction, Request, Response } from "express";
import { makeResolveSystemAccessService } from "../../../container";
import AppError from "../../../errors/AppError";

export type RequiredSystemAccess = "viewer" | "editor";

export default function ensureSystemAccess(required: RequiredSystemAccess) {
  return function systemAccessMiddleware(
    request: Request & {
      user?: {
        id: number;
      };
    },
    _response: Response,
    next: NextFunction
  ) {
    if (!request.user) {
      throw new AppError("JWT token is missing", 401);
    }

    const resolveSystemAccess = makeResolveSystemAccessService();
    resolveSystemAccess
      .execute(request.user.id)
      .then((access) => {
        if (!access) {
          throw new AppError("User has no system access profile", 403);
        }

        if (required === "viewer" && access.permissions.canViewManagementData) {
          return next();
        }

        if (required === "editor" && access.permissions.canEditManagementData) {
          return next();
        }

        throw new AppError(
          "You do not have permission to access this resource",
          403
        );
      })
      .catch(next);
  };
}
