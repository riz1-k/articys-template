import type { MiddlewareHandler } from "hono";
import type { HealthStatusService } from "@/modules/health/application/create-health-status-service";
import type { AuthHandler } from "@/modules/identity/application/auth-handler.port";
import type { IdentitySessionService } from "@/modules/identity/application/create-identity-session-service";
import type { TodoUseCases } from "@/modules/todos/application/create-todo-use-cases";

export interface AppHttpDependencies {
	cors: MiddlewareHandler;
	rateLimiter: MiddlewareHandler;
	requestLogger: MiddlewareHandler;
	securityHeaders: MiddlewareHandler;
}

export interface AppDependencies {
	auth: AuthHandler;
	healthStatusService: HealthStatusService;
	http: AppHttpDependencies;
	identitySessionService: IdentitySessionService;
	todoUseCases: TodoUseCases;
}
