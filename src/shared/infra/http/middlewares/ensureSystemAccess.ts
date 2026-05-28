import { NextFunction, Request, Response } from "express";
import { SystemAccessScope } from "../../../../modules/auth/services/ResolveSystemAccessService";
import { makeResolveSystemAccessService } from "../../../container";
import AppError from "../../../errors/AppError";

export type RequiredSystemAccess = "viewer" | "editor";

export default function ensureSystemAccess(required: RequiredSystemAccess) {
  return function systemAccessMiddleware(
    request: Request & {
      user?: {
        id: number;
        access?: {
          scope: SystemAccessScope;
          churchId: number;
          level: string;
        };
      };
    },
    _response: Response,
    next: NextFunction
  ) {
    if (!request.user) {
      throw new AppError("JWT token is missing", 401);
    }

    const userId = request.user.id;

    const resolveSystemAccess = makeResolveSystemAccessService();
    resolveSystemAccess
      .execute(userId)
      .then((access) => {
        if (!access) {
          throw new AppError("User has no system access profile", 403);
        }

        request.user = {
          id: userId,
          access: {
            scope: access.scope,
            churchId: access.churchId,
            level: access.level,
          },
        };

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
