import { NextFunction, Request, Response } from "express";

export default function errorHandler(
  error: Error & { statusCode?: number },
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (typeof error.statusCode === "number") {
    return response.status(error.statusCode).json({ error: error.message });
  }

  return response.status(500).json({ error: error.message || "Internal server error" });
}
