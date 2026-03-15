import { createHealthStatusService } from "@/modules/health/application/create-health-status-service";
import { createCacheHealthCheck } from "@/modules/health/infrastructure/cache-health-check";
import { createDatabaseHealthCheck } from "@/modules/health/infrastructure/database-health-check";
import { auth } from "@/modules/identity/infrastructure/better-auth";

export function createAppDependencies() {
	return {
		auth,
		healthStatusService: createHealthStatusService({
			database: createDatabaseHealthCheck(),
			cache: createCacheHealthCheck(),
		}),
	};
}
