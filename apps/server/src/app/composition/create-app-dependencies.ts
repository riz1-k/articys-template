import { createHealthStatusService } from "@/modules/health/application/create-health-status-service";
import { createCacheHealthCheck } from "@/modules/health/infrastructure/cache-health-check";
import { createDatabaseHealthCheck } from "@/modules/health/infrastructure/database-health-check";
import { createIdentitySessionService } from "@/modules/identity/application/create-identity-session-service";
import { auth } from "@/modules/identity/infrastructure/better-auth";
import { createBetterAuthSessionPort } from "@/modules/identity/infrastructure/better-auth-session.port";
import { createTodoUseCases } from "@/modules/todos/application/create-todo-use-cases";
import { createDrizzleTodoRepository } from "@/modules/todos/infrastructure/drizzle-todo-repository";

export function createAppDependencies() {
	const identitySessionService = createIdentitySessionService(
		createBetterAuthSessionPort(auth),
	);

	return {
		auth,
		identitySessionService,
		healthStatusService: createHealthStatusService({
			database: createDatabaseHealthCheck(),
			cache: createCacheHealthCheck(),
		}),
		todoUseCases: createTodoUseCases(createDrizzleTodoRepository()),
	};
}
