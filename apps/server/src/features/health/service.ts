import type { HealthCheckPort } from "./ports";
import type { HealthStatusResult } from "./types";

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
			const [databaseStatus, cacheStatus] = await Promise.all([
				database.check(),
				cache.check(),
			]);

			return {
				status:
					databaseStatus === "error" || cacheStatus === "error"
						? "degraded"
						: "ok",
				checks: {
					[database.name]: databaseStatus,
					[cache.name]: cacheStatus,
				},
				timestamp: new Date().toISOString(),
			};
		},
	};
}

export const createHealthService = createHealthStatusService;
