import { NextFunction, Request, Response } from "express";
import {
  costRepository,
  cultRepository,
  managerRepository,
  memberRepository,
  offerRepository,
  specialOfferRepository,
  titheRepository,
  treasurerRepository,
} from "../../../container";
import AppError from "../../../errors/AppError";
import { SystemAccessScope } from "../../../../modules/auth/services/ResolveSystemAccessService";

type Source = "params" | "body";
type ResourceName =
  | "member"
  | "manager"
  | "cost"
  | "cult"
  | "treasurer"
  | "offer"
  | "specialOffer"
  | "tithe";

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
    case "treasurer":
      return treasurerRepository.findById(id).then((treasurer) =>
        treasurer?.member ? treasurer.member.id_church : undefined
      );
    case "offer":
      return offerRepository.findById(id).then((offer) =>
        offer?.treasurer?.member ? offer.treasurer.member.id_church : undefined
      );
    case "specialOffer":
      return specialOfferRepository.findById(id).then((specialOffer) =>
        specialOffer ? specialOffer.id_church : undefined
      );
    case "tithe":
      return titheRepository.findById(id).then((tithe) =>
        tithe?.specialOffer ? tithe.specialOffer.id_church : undefined
      );
  }
}

export default function ensureScopedResourceAccess(
  resource: ResourceName,
  idField = "id",
  source: Source = "params"
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

    const rawId =
      source === "params" ? request.params[idField] : request.body?.[idField];
    const resourceId = Number(rawId);

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
