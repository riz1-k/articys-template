import type { Hono } from "hono";
import { auth } from "../configs/auth.config";

export function registerAuthRoutes(app: Hono) {
	app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
}
