import { randomUUID } from "node:crypto";
import type { Context, Next } from "hono";
import { STATUS_CODES } from "@/lib/constants/status-codes";
import { logger } from "../lib/utils/logger";

export async function requestLogger(c: Context, next: Next) {
	const requestId = c.req.header("X-Request-ID") ?? randomUUID();
	c.set("requestId", requestId);

	const startedAt = performance.now();
	const method = c.req.method;
	const path = c.req.path;

	await next();

	const durationMs = Math.round(performance.now() - startedAt);
	const status = c.res.status;

	const logMeta = {
		requestId,
		method,
		path,
		status,
		durationMs,
		ip:
			c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown",
		userAgent: c.req.header("user-agent"),
	};

	if (status >= STATUS_CODES.INTERNAL_SERVER_ERROR) {
		logger.error(logMeta, "http request");
		return;
	}

	if (status >= STATUS_CODES.BAD_REQUEST) {
		logger.warn(logMeta, "http request");
		return;
	}

	logger.info(logMeta, "http request");
}
