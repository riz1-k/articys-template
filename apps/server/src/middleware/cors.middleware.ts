import { cors } from "hono/cors";
import { env } from "../configs/env.config";

export const corsMiddleware = cors({
	origin: env.CORS_ORIGIN,
	allowMethods: ["GET", "POST", "OPTIONS"],
	allowHeaders: ["Content-Type", "Authorization"],
	credentials: true,
});
