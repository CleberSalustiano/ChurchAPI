import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import authConfig from "../../../config/auth";
import { hasTemporaryMemberPassword } from "../../../security/password";
import {
  memberRepository,
  userRepository,
} from "../../../container";
import AppError from "../../../errors/AppError";

interface ITokenPayload {
  sub: string;
}

type RequestWithUser = Request & {
  user?: {
    id: number;
    memberId?: number;
    mustChangePassword?: boolean;
  };
};

function isPasswordChangeAllowedRoute(request: Request) {
  const routePath = `${request.baseUrl}${request.path}`;

  if (request.method === "GET" && routePath === "/me") {
    return true;
  }

  if (
    request.method === "PATCH" &&
    /^\/user\/\d+\/password$/.test(routePath)
  ) {
    return true;
  }

  return false;
}

export default function ensureAuthenticated(
  request: RequestWithUser,
  _response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return next(new AppError("JWT token is missing", 401));
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return next(new AppError("JWT token is missing", 401));
  }

  let userId: number;

  try {
    const decoded = verify(token, authConfig.jwt.secret) as ITokenPayload;
    userId = Number(decoded.sub);
  } catch {
    return next(new AppError("Invalid JWT token", 401));
  }

  return Promise.all([
    userRepository.findById(userId),
    memberRepository.findByUserId(userId),
  ])
    .then(async ([user, member]) => {
      if (!user) {
        throw new AppError("Invalid authenticated session", 401);
      }

      if (!member) {
        throw new AppError("Authenticated member profile not found", 403);
      }

      if (!member.church || member.church.status !== "ACTIVE") {
        throw new AppError("This church is not active", 403);
      }

      const mustChangePassword = await hasTemporaryMemberPassword(
        user.password,
        member.cpf
      );

      request.user = {
        id: userId,
        memberId: member.id,
        mustChangePassword,
      };

      if (mustChangePassword && !isPasswordChangeAllowedRoute(request)) {
        throw new AppError(
          "Password change is required before accessing this resource",
          403
        );
      }

      return next();
    })
    .catch((error) => {
      if (error instanceof AppError) {
        return next(error);
      }

      return next(new AppError("Invalid authenticated session", 401));
    });
}
