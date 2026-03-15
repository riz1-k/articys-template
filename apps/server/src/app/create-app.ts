import { Hono } from "hono";
import { corsMiddleware } from "@/middleware/cors.middleware";
import { rateLimiter } from "@/middleware/rate-limiter.middleware";
import { requestLogger } from "@/middleware/request-logger.middleware";
import { securityHeaders } from "@/middleware/security-headers.middleware";
import type { createHealthStatusService } from "@/modules/health/application/create-health-status-service";
import type { createIdentitySessionService } from "@/modules/identity/application/create-identity-session-service";
import type { AuthHandler } from "@/modules/identity/presentation/http/auth.routes";
import type { TodoUseCases } from "@/modules/todos/application/create-todo-use-cases";
import { appConfig } from "@/platform/config/app.config";
import { errorHandler } from "@/platform/http/error-handler";
import { createAppDependencies } from "./composition/create-app-dependencies";
import { registerRoutes } from "./register-routes";

export interface AppDependencies {
	auth: AuthHandler;
	healthStatusService: ReturnType<typeof createHealthStatusService>;
	identitySessionService: ReturnType<typeof createIdentitySessionService>;
	todoUseCases: TodoUseCases;
}

export function createApp(
	dependencies: AppDependencies = createAppDependencies(),
) {
	const app = new Hono();

	app.use(requestLogger);
	app.use("*", securityHeaders(appConfig.security));
	app.use("*", corsMiddleware);
	app.use(rateLimiter(appConfig.rateLimit));
	app.onError(errorHandler);

	registerRoutes(app, dependencies);

	app.get("/", (c) => {
		return c.json({ status: "ok", message: "Articys API" });
	});

	return app;
}
