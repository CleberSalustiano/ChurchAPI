import { NextFunction, Request, Response } from "express";
import AppError from "../../../errors/AppError";

type RequestWithUser = Request & {
  user?: {
    id: number;
  };
};

export default function ensureSelfUserAccess(
  request: RequestWithUser,
  _response: Response,
  next: NextFunction
) {
  const id = Number(request.params.id);

  if (!request.user || request.user.id !== id) {
    throw new AppError("You can only manage your own credentials", 403);
  }

  return next();
}
