import type { Hono } from "hono";
import type { AuthHandler } from "@/features/auth/auth-handler";

export function registerAuthRoutes(app: Hono, auth: AuthHandler) {
	app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
}
