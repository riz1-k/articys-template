import type { Hono } from "hono";
import type { AuthHandler } from "@/modules/identity/application/auth-handler.port";

export function registerAuthRoutes(app: Hono, auth: AuthHandler) {
	app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
}
