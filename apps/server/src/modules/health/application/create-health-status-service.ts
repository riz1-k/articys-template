import type { HealthCheckPort } from "./health.ports";
import type { HealthStatusResult } from "./health.types";

interface HealthStatusDependencies {
	database: HealthCheckPort;
	cache: HealthCheckPort;
}

export interface HealthStatusService {
	getStatus(): Promise<HealthStatusResult>;
}

export function createHealthStatusService({
	database,
	cache,
}: HealthStatusDependencies): HealthStatusService {
	return {
		async getStatus(): Promise<HealthStatusResult> {
			const [dbHealthy, cacheHealthy] = await Promise.all([
				database.check(),
				cache.check(),
			]);

			return {
				status: dbHealthy ? "ok" : "degraded",
				checks: {
					[database.name]: dbHealthy ? "ok" : "error",
					[cache.name]: cacheHealthy
						? "ok"
						: (cache.disabledStatus ?? "disabled"),
				},
				timestamp: new Date().toISOString(),
			};
		},
	};
}
