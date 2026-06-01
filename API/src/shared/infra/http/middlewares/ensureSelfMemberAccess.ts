import { NextFunction, Request, Response } from "express";
import AppError from "../../../errors/AppError";

type RequestWithUser = Request & {
  user?: {
    id: number;
    memberId?: number;
  };
};

export default function ensureSelfMemberAccess(
  request: RequestWithUser,
  _response: Response,
  next: NextFunction
) {
  const id = Number(request.params.id);

  if (!request.user || request.user.memberId !== id) {
    throw new AppError("You can only manage your own member profile", 403);
  }

  return next();
}
