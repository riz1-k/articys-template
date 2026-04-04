import type { AppDependencies } from "@/app/app-dependencies";
import { redis } from "@/infrastructure/cache";
import { createEmailDelivery } from "@/infrastructure/email/create-email-delivery";
import { createBillingUseCases } from "@/modules/billing/application/create-billing-use-cases";
import { createTodoEntitlementService } from "@/modules/billing/application/create-todo-entitlement-service";
import { createDrizzleBillingRepository } from "@/modules/billing/infrastructure/drizzle-billing.repository";
import { createStripeGateway } from "@/modules/billing/infrastructure/stripe-gateway";
import { createHealthStatusService } from "@/modules/health/application/create-health-status-service";
import { createCacheHealthCheck } from "@/modules/health/infrastructure/cache-health-check";
import { createDatabaseHealthCheck } from "@/modules/health/infrastructure/database-health-check";
import { createIdentitySessionService } from "@/modules/identity/application/create-identity-session-service";
import { createAuthEmailSender } from "@/modules/identity/infrastructure/auth-email.sender";
import { createBetterAuth } from "@/modules/identity/infrastructure/better-auth";
import { createBetterAuthSessionPort } from "@/modules/identity/infrastructure/better-auth-session.port";
import { createShippingUseCases } from "@/modules/shipping/application/create-shipping-use-cases";
import { createDrizzleShippingRepository } from "@/modules/shipping/infrastructure/drizzle-shipping.repository";
import { createEcontGateway } from "@/modules/shipping/infrastructure/econt-gateway";
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
	const todoRepository = createDrizzleTodoRepository();
	const billingRepository = createDrizzleBillingRepository();
	const shippingRepository = createDrizzleShippingRepository();
	const todoEntitlementService =
		createTodoEntitlementService(billingRepository);
	const billingUseCases = createBillingUseCases({
		billingGateway: createStripeGateway({
			secretKey: env.STRIPE_SECRET_KEY,
			webhookSecret: env.STRIPE_WEBHOOK_SECRET,
			priceIds: {
				monthly: env.STRIPE_PRICE_ID_MONTHLY,
				yearly: env.STRIPE_PRICE_ID_YEARLY,
			},
		}),
		billingRepository,
		successUrl: appConfig.billing.successUrl,
		cancelUrl: appConfig.billing.cancelUrl,
		todoCountPort: {
			countTodosByUserId: (userId) => todoRepository.countByUserId(userId),
		},
		todoEntitlementPort: todoEntitlementService,
	});
	const shippingUseCases = createShippingUseCases({
		shippingGateway: createEcontGateway({
			username: env.ECONT_USERNAME,
			password: env.ECONT_PASSWORD,
			environment: env.ECONT_ENVIRONMENT,
			timeout: env.ECONT_TIMEOUT_MS,
			maxRetries: env.ECONT_MAX_RETRIES,
		}),
		shippingRepository,
	});

	return {
		auth,
		billingUseCases,
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
		shippingUseCases,
		todoUseCases: createTodoUseCases(todoRepository, todoEntitlementService),
	};
}
