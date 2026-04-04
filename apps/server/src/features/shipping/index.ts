import type { Hono } from "hono";
import { env } from "@/core/config/env.config";
import type { IdentitySessionService } from "@/features/auth";
import { createDrizzleShippingRepository } from "./drizzle-shipping.repository";
import { createEcontGateway } from "./econt";
import { registerShippingRoutes } from "./routes";
import { createShippingService, type ShippingService } from "./service";

export type { ShippingService, ShippingUseCases } from "./service";

export interface ShippingFeature {
	register(app: Hono): void;
	service: ShippingService;
}

export function createShippingFeature(input: {
	identitySessionService: IdentitySessionService;
}): ShippingFeature {
	const service = createShippingService({
		shippingGateway: createEcontGateway({
			username: env.ECONT_USERNAME,
			password: env.ECONT_PASSWORD,
			environment: env.ECONT_ENVIRONMENT,
			timeout: env.ECONT_TIMEOUT_MS,
			maxRetries: env.ECONT_MAX_RETRIES,
		}),
		shippingRepository: createDrizzleShippingRepository(),
	});

	return {
		service,
		register(app) {
			registerShippingRoutes(app, input.identitySessionService, service);
		},
	};
}
