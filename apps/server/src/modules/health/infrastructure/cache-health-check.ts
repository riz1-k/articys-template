import { isCacheConfigured, pingCache } from "@/infrastructure/cache";

export function createCacheHealthCheck() {
	return {
		name: "cache",
		async check() {
			if (!isCacheConfigured()) {
				return "disabled" as const;
			}

			return (await pingCache()) ? ("ok" as const) : ("error" as const);
		},
	};
}
