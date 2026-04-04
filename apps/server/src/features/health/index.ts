import type { Hono } from "hono";
import { createCacheHealthCheck } from "./cache-health-check";
import { createDatabaseHealthCheck } from "./database-health-check";
import { registerHealthRoutes } from "./routes";
import { createHealthStatusService, type HealthStatusService } from "./service";

export type { HealthStatusService } from "./service";

export interface HealthFeature {
	register(app: Hono): void;
	service: HealthStatusService;
}

export function createHealthFeature(): HealthFeature {
	const service = createHealthStatusService({
		database: createDatabaseHealthCheck(),
		cache: createCacheHealthCheck(),
	});

	return {
		service,
		register(app) {
			registerHealthRoutes(app, service);
		},
	};
}
