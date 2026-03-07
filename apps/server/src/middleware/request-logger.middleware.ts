import type { Context, Next } from "hono";
import { logger } from "../lib/logger";

export async function requestLogger(c: Context, next: Next) {
	const startedAt = performance.now();
	await next();
	const durationMs = Math.round(performance.now() - startedAt);
	const status = c.res.status;

	const logMeta = {
		method: c.req.method,
		path: c.req.path,
		status,
		durationMs,
		ip:
			c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown",
	};

	if (status >= 500) {
		logger.error(logMeta, "http request");
		return;
	}

	if (status >= 400) {
		logger.warn(logMeta, "http request");
		return;
	}

	logger.info(logMeta, "http request");
}
