import type { Hono } from "hono";
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
			isHealthy ? 200 : 503,
		);
	});

	app.get("/health/live", (c) => {
		return c.json({ status: "ok" });
	});
}
