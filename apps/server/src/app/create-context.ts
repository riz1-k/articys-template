import type { MiddlewareHandler } from "hono";
import { redis } from "@/core/cache";
import { appConfig } from "@/core/config/app.config";
import { createCorsMiddleware } from "@/core/http/cors";
import { createRateLimiter } from "@/core/http/rate-limiter";
import { createRequestLogger } from "@/core/http/request-logger";
import { createSecurityHeaders } from "@/core/http/security-headers";
import { logger } from "@/core/observability/logger";
import { type AuthFeature, createAuthFeature } from "@/features/auth";
import { type BillingFeature, createBillingFeature } from "@/features/billing";
import { createHealthFeature, type HealthFeature } from "@/features/health";
import {
	createShippingFeature,
	type ShippingFeature,
} from "@/features/shipping";
import {
	createDrizzleTodoRepository,
	createTodosFeature,
	type TodosFeature,
} from "@/features/todos";

export interface AppHttpDependencies {
	cors: MiddlewareHandler;
	rateLimiter: MiddlewareHandler;
	requestLogger: MiddlewareHandler;
	securityHeaders: MiddlewareHandler;
}

export interface AppContext {
	features: {
		auth: AuthFeature;
		billing: BillingFeature;
		health: HealthFeature;
		shipping: ShippingFeature;
		todos: TodosFeature;
	};
	http: AppHttpDependencies;
}

export function createAppContext(): AppContext {
	const auth = createAuthFeature();
	const todoRepository = createDrizzleTodoRepository();
	const billing = createBillingFeature({
		identitySessionService: auth.sessionService,
		todoCountPort: {
			countTodosByUserId: (userId) => todoRepository.countByUserId(userId),
		},
	});

	return {
		features: {
			auth,
			billing,
			health: createHealthFeature(),
			shipping: createShippingFeature({
				identitySessionService: auth.sessionService,
			}),
			todos: createTodosFeature({
				identitySessionService: auth.sessionService,
				todoEntitlementPort: billing.service,
				todoRepository,
			}),
		},
		http: {
			cors: createCorsMiddleware(appConfig.cors),
			rateLimiter: createRateLimiter({
				config: appConfig.rateLimit,
				logger,
				store: redis,
			}),
			requestLogger: createRequestLogger(logger),
			securityHeaders: createSecurityHeaders(appConfig.security),
		},
	};
}
