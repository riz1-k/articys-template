import type { Hono } from "hono";

export interface AuthHandler {
	handler(request: Request): Response | Promise<Response>;
}

export function registerAuthRoutes(app: Hono, auth: AuthHandler) {
	app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
}
