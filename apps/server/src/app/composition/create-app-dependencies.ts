import type { AppDependencies } from "@/app/app-dependencies";
import { redis } from "@/infrastructure/cache";
import { createEmailDelivery } from "@/infrastructure/email/create-email-delivery";
import { createHealthStatusService } from "@/modules/health/application/create-health-status-service";
import { createCacheHealthCheck } from "@/modules/health/infrastructure/cache-health-check";
import { createDatabaseHealthCheck } from "@/modules/health/infrastructure/database-health-check";
import { createIdentitySessionService } from "@/modules/identity/application/create-identity-session-service";
import { createAuthEmailSender } from "@/modules/identity/infrastructure/auth-email.sender";
import { createBetterAuth } from "@/modules/identity/infrastructure/better-auth";
import { createBetterAuthSessionPort } from "@/modules/identity/infrastructure/better-auth-session.port";
import { createTodoUseCases } from "@/modules/todos/application/create-todo-use-cases";
import { createDrizzleTodoRepository } from "@/modules/todos/infrastructure/drizzle-todo-repository";
import { appConfig } from "@/platform/config/app.config";
import { env } from "@/platform/config/env.config";
import { createCorsMiddleware } from "@/platform/http/cors";
import { createRateLimiter } from "@/platform/http/rate-limiter";
import { createRequestLogger } from "@/platform/http/request-logger";
import { createSecurityHeaders } from "@/platform/http/security-headers";
import { logger } from "@/platform/observability/logger";

export function createAppDependencies(): AppDependencies {
	const emailDelivery = createEmailDelivery({
		logger,
		isProduction: appConfig.isProduction,
		resendApiKey: env.RESEND_API_KEY,
	});
	const authEmailSender = createAuthEmailSender({
		emailDelivery,
		from: env.EMAIL_FROM,
		replyTo: env.EMAIL_REPLY_TO,
		isProduction: appConfig.isProduction,
	});
	const auth = createBetterAuth(authEmailSender);
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
		todoUseCases: createTodoUseCases(createDrizzleTodoRepository()),
	};
}
