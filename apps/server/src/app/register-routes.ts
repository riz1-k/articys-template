import type { Hono } from "hono";
import { registerHealthRoutes } from "@/modules/health/presentation/http/health.routes";
import { registerAuthRoutes } from "@/modules/identity/presentation/http/auth.routes";
import { registerCurrentUserRoutes } from "@/modules/identity/presentation/http/current-user.routes";
import type { AppDependencies } from "./create-app";

export function registerRoutes(app: Hono, dependencies: AppDependencies) {
	registerHealthRoutes(app, dependencies.healthStatusService);
	registerAuthRoutes(app, dependencies.auth);
	registerCurrentUserRoutes(app, dependencies.identitySessionService);
}
