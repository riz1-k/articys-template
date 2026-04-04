import type { Server } from "bun";
import { isCacheConfigured, pingCache } from "@/core/cache";
import { appConfig } from "@/core/config/app.config";
import { pingDatabase } from "@/core/database";
import { logger } from "@/core/observability/logger";

const MS_PER_SECOND = 1000;

function maskCorsOrigin(origin: string): string {
	try {
		return new URL(origin).host;
	} catch {
		return "(invalid)";
	}
}

export async function logStartup(
	server: Server<undefined>,
	startTime?: number,
): Promise<void> {
	const readyMs = startTime != null ? Date.now() - startTime : undefined;

	const cacheConfigured = isCacheConfigured();
	const [dbOk, cacheOk] = await Promise.all([
		pingDatabase(),
		cacheConfigured ? pingCache() : Promise.resolve(false),
	]);

	const dbIcon = dbOk ? "OK" : "ERR";
	const cacheIcon = cacheOk ? "OK" : "OFF";
	const databaseStatus = dbOk ? "ok" : "error";
	const cacheStatus = !cacheConfigured ? "disabled" : cacheOk ? "ok" : "error";

	if (appConfig.isDevelopment) {
		logger.info(
			{
				event: "startup",
				env: appConfig.env,
				logLevel: appConfig.logging.level,
			},
			`Articys API ${appConfig.env} log ${appConfig.logging.level}`,
		);
		logger.info(
			{ event: "startup_server", url: server.url, port: server.port },
			`${server.url} (port ${server.port})`,
		);
		logger.info(
			{
				event: "startup_services",
				database: databaseStatus,
				cache: cacheStatus,
			},
			`Database ${dbIcon} Cache ${cacheIcon}${cacheOk ? " (Redis)" : ""}`,
		);
		const windowSec = appConfig.rateLimit.windowMs / MS_PER_SECOND;
		logger.info(
			{
				event: "startup_config",
				rateLimitWindowSec: windowSec,
				rateLimitMax: appConfig.rateLimit.maxRequests,
				corsOrigin: maskCorsOrigin(appConfig.cors.origin),
			},
			`Rate ${windowSec}s / ${appConfig.rateLimit.maxRequests} req CORS ${maskCorsOrigin(appConfig.cors.origin)}`,
		);
		if (readyMs != null) {
			logger.info({ event: "startup_ready", readyMs }, `Ready in ${readyMs}ms`);
		}
	} else {
		logger.info(
			{
				event: "startup",
				url: server.url,
				port: server.port,
				hostname: server.hostname,
				database: databaseStatus,
				cache: cacheStatus,
				readyMs,
			},
			`Server ready ${server.url} DB ${dbIcon} Cache ${cacheIcon}`,
		);
	}
}
