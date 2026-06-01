import { NextFunction, Request, Response } from "express";
import AppError from "../../../errors/AppError";
import { SystemAccessScope } from "../../../../modules/auth/services/ResolveSystemAccessService";

type RequestWithSystemAccess = Request & {
  user?: {
    id: number;
    access?: {
      scope: SystemAccessScope;
      churchId: number;
    };
  };
};

export default function ensureGlobalSystemAccess(
  request: RequestWithSystemAccess,
  _response: Response,
  next: NextFunction
) {
  if (!request.user?.access) {
    throw new AppError("User access context is missing", 403);
  }

  if (request.user.access.scope !== "GLOBAL") {
    throw new AppError(
      "You do not have permission to manage data outside your church scope",
      403
    );
  }

  return next();
}
