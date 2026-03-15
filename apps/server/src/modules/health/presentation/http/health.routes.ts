import type { Hono } from "hono";
import { STATUS_CODES } from "@/lib/constants/status-codes";
import type { HealthStatusService } from "@/modules/health/application/create-health-status-service";

export function registerHealthRoutes(
	app: Hono,
	healthStatusService: HealthStatusService,
) {
	app.get("/health", async (c) => {
		const status = await healthStatusService.getStatus();

		return c.json(
			status,
			status.status === "ok"
				? STATUS_CODES.OK
				: STATUS_CODES.INTERNAL_SERVER_ERROR,
		);
	});

	app.get("/health/live", (c) => {
		return c.json({ status: "ok" });
	});
}
