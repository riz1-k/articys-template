import { cors } from "hono/cors";
import { env } from "../lib/configs/env.config";

export const corsMiddleware = cors({
	origin: env.CORS_ORIGIN,
	allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
	credentials: true,
});
