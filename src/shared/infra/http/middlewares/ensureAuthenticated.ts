import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import authConfig from "../../../config/auth";
import AppError from "../../../errors/AppError";

interface ITokenPayload {
  sub: string;
}

type RequestWithUser = Request & {
  user?: {
    id: number;
  };
};

export default function ensureAuthenticated(
  request: RequestWithUser,
  _response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT token is missing", 401);
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    throw new AppError("JWT token is missing", 401);
  }

  try {
    const decoded = verify(token, authConfig.jwt.secret) as ITokenPayload;

    request.user = {
      id: Number(decoded.sub),
    };

    return next();
  } catch {
    throw new AppError("Invalid JWT token", 401);
  }
}
