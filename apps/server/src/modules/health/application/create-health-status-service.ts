import type { HealthCheckPort } from "./health.ports";
import type { HealthStatusResult } from "./health.types";

interface HealthStatusDependencies {
	database: HealthCheckPort;
	cache: HealthCheckPort;
}

export function createHealthStatusService({
	database,
	cache,
}: HealthStatusDependencies) {
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
