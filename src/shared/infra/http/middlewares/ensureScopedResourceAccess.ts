import { NextFunction, Request, Response } from "express";
import {
  costRepository,
  cultRepository,
  managerRepository,
  memberRepository,
} from "../../../container";
import AppError from "../../../errors/AppError";
import { SystemAccessScope } from "../../../../modules/auth/services/ResolveSystemAccessService";

type ResourceName = "member" | "manager" | "cost" | "cult";

type RequestWithSystemAccess = Request & {
  user?: {
    id: number;
    access?: {
      scope: SystemAccessScope;
      churchId: number;
    };
  };
};

function getChurchIdFromResource(resource: ResourceName, id: number) {
  switch (resource) {
    case "member":
      return memberRepository.findById(id).then((member) =>
        member ? member.id_church : undefined
      );
    case "manager":
      return managerRepository.findById(id).then((manager) =>
        manager ? manager.id_church : undefined
      );
    case "cost":
      return costRepository.findById(id).then((cost) =>
        cost ? cost.id_church : undefined
      );
    case "cult":
      return cultRepository.findById(id).then((cult) =>
        cult ? cult.id_church : undefined
      );
  }
}

export default function ensureScopedResourceAccess(
  resource: ResourceName,
  idParam = "id"
) {
  return function scopedResourceMiddleware(
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

    const resourceId = Number(request.params[idParam]);

    if (Number.isNaN(resourceId)) {
      throw new AppError("Scoped resource id is invalid", 400);
    }

    getChurchIdFromResource(resource, resourceId)
      .then((churchId) => {
        if (churchId === undefined) {
          throw new AppError("Scoped resource was not found", 404);
        }

        if (churchId !== request.user!.access!.churchId) {
          throw new AppError(
            "You do not have permission to manage data outside your church scope",
            403
          );
        }

        return next();
      })
      .catch(next);
  };
}
