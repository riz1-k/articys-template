import { isCacheConfigured, pingCache } from "@/core/cache";

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
