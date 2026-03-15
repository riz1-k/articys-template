import { isCacheConfigured, pingCache } from "@/infrastructure/cache";

export function createCacheHealthCheck() {
	return {
		name: "cache",
		disabledStatus: "disabled" as const,
		async check() {
			if (!isCacheConfigured()) {
				return false;
			}

			return pingCache();
		},
	};
}
