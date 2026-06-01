import { NextFunction, Request, Response } from "express";
import AppError from "../../../errors/AppError";
import { SystemAccessScope } from "../../../../modules/auth/services/ResolveSystemAccessService";

type Source = "body" | "params";

type RequestWithSystemAccess = Request & {
  user?: {
    id: number;
    access?: {
      scope: SystemAccessScope;
      churchId: number;
    };
  };
};

interface IOptions {
  source: Source;
  field: string;
}

export default function ensureChurchScope({ source, field }: IOptions) {
  return function churchScopeMiddleware(
    request: RequestWithSystemAccess,
    _response: Response,
    next: NextFunction
  ) {
    if (!request.user?.access) {
      throw new AppError("User access context is missing", 403);
    }

    if (request.user.access.scope === "GLOBAL") {
      return next();
    }

    const sourceData = source === "body" ? request.body : request.params;
    const rawValue = sourceData?.[field];

    if (rawValue === undefined) {
      throw new AppError("Church scope target is missing", 400);
    }

    const targetChurchId = Number(rawValue);

    if (Number.isNaN(targetChurchId)) {
      throw new AppError("Church scope target is invalid", 400);
    }

    if (targetChurchId !== request.user.access.churchId) {
      throw new AppError(
        "You do not have permission to manage data outside your church scope",
        403
      );
    }

    return next();
  };
}
