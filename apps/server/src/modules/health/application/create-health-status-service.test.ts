import { describe, expect, it } from "vitest";
import { createHealthStatusService } from "./create-health-status-service";

describe("createHealthStatusService", () => {
	it("returns degraded when a configured dependency is unhealthy", async () => {
		const service = createHealthStatusService({
			database: {
				name: "database",
				check: async () => "ok" as const,
			},
			cache: {
				name: "cache",
				check: async () => "error" as const,
			},
		});

		await expect(service.getStatus()).resolves.toMatchObject({
			status: "degraded",
			checks: {
				database: "ok",
				cache: "error",
			},
		});
	});

	it("keeps overall status ok when an optional dependency is disabled", async () => {
		const service = createHealthStatusService({
			database: {
				name: "database",
				check: async () => "ok" as const,
			},
			cache: {
				name: "cache",
				check: async () => "disabled" as const,
			},
		});

		await expect(service.getStatus()).resolves.toMatchObject({
			status: "ok",
			checks: {
				database: "ok",
				cache: "disabled",
			},
		});
	});
});
