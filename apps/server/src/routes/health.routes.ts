import type { Hono } from "hono";
import { STATUS_CODES } from "@/lib/constants/status-codes";
import { pingCache } from "../infrastructure/cache";
import { pingDatabase } from "../infrastructure/database";

export function registerHealthRoutes(app: Hono) {
	app.get("/health", async (c) => {
		const [dbHealthy, cacheHealthy] = await Promise.all([
			pingDatabase(),
			pingCache(),
		]);

		const isHealthy = dbHealthy;

		return c.json(
			{
				status: isHealthy ? "ok" : "degraded",
				checks: {
					database: dbHealthy ? "ok" : "error",
					cache: cacheHealthy ? "ok" : "disabled",
				},
				timestamp: new Date().toISOString(),
			},
			isHealthy ? STATUS_CODES.OK : STATUS_CODES.INTERNAL_SERVER_ERROR,
		);
	});

	app.get("/health/live", (c) => {
		return c.json({ status: "ok" });
	});
}
