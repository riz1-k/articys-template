import type { Hono } from "hono";
import { appConfig } from "@/core/config/app.config";
import { env } from "@/core/config/env.config";
import type { IdentitySessionService } from "@/features/auth";
import { createDrizzleBillingRepository } from "./drizzle-billing.repository";
import { createTodoEntitlementService } from "./entitlements";
import { registerBillingRoutes } from "./routes";
import { type BillingService, createBillingService } from "./service";
import { createStripeGateway } from "./stripe";
import type { TodoCountPort } from "./todo-count.port";

export type { BillingService, BillingUseCases } from "./service";

export interface BillingFeature {
	register(app: Hono): void;
	service: BillingService;
}

export function createBillingFeature(input: {
	identitySessionService: IdentitySessionService;
	todoCountPort: TodoCountPort;
}): BillingFeature {
	const billingRepository = createDrizzleBillingRepository();
	const todoEntitlementService =
		createTodoEntitlementService(billingRepository);
	const service = createBillingService({
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
		todoCountPort: input.todoCountPort,
		todoEntitlementPort: todoEntitlementService,
	});

	return {
		service,
		register(app) {
			registerBillingRoutes(app, input.identitySessionService, service);
		},
	};
}
