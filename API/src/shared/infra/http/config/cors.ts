import { CorsOptions } from "cors";

export function resolveCorsOptions(
  rawOrigins = process.env.CORS_ORIGINS
): CorsOptions {
  const origins = rawOrigins
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (!origins?.length || origins.includes("*")) {
    return {
      origin: true,
      credentials: true,
    };
  }

  return {
    origin: origins,
    credentials: true,
  };
}
