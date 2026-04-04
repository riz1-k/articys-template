import type { Hono } from "hono";
import { registerBillingRoutes } from "@/modules/billing/presentation/http/billing.routes";
import { registerHealthRoutes } from "@/modules/health/presentation/http/health.routes";
import { registerAuthRoutes } from "@/modules/identity/presentation/http/auth.routes";
import { registerCurrentUserRoutes } from "@/modules/identity/presentation/http/current-user.routes";
import { registerShippingRoutes } from "@/modules/shipping/presentation/http/shipping.routes";
import { registerTodoRoutes } from "@/modules/todos/presentation/http/todo.routes";
import type { AppDependencies } from "./create-app";

export function registerRoutes(app: Hono, dependencies: AppDependencies) {
	registerHealthRoutes(app, dependencies.healthStatusService);
	registerAuthRoutes(app, dependencies.auth);
	registerCurrentUserRoutes(app, dependencies.identitySessionService);
	registerBillingRoutes(
		app,
		dependencies.identitySessionService,
		dependencies.billingUseCases,
	);
	registerShippingRoutes(
		app,
		dependencies.identitySessionService,
		dependencies.shippingUseCases,
	);
	registerTodoRoutes(
		app,
		dependencies.identitySessionService,
		dependencies.todoUseCases,
	);
}
