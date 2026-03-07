import type { Hono } from "hono";
import { registerAuthRoutes } from "./auth.routes";
import { registerHealthRoutes } from "./health.routes";

export function registerRoutes(app: Hono) {
	registerHealthRoutes(app);
	registerAuthRoutes(app);
}
