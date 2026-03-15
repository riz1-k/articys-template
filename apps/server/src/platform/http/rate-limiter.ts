import type { MiddlewareHandler } from "hono";
import { MS_IN_SECOND } from "@/lib/constants";
import { STATUS_CODES } from "@/lib/constants/status-codes";
import { ErrorCodes } from "./error-codes";

export interface RateLimiterConfig {
	windowMs: number;
	maxRequests: number;
	keyPrefix?: string;
}

export interface RateLimitStore {
	zAdd(key: string, member: { score: number; value: string }): Promise<unknown>;
	zRemRangeByScore(key: string, min: number, max: number): Promise<unknown>;
	zCard(key: string): Promise<number>;
	expire(key: string, seconds: number): Promise<unknown>;
}

interface RateLimitLogger {
	warn(payload: object, message: string): void;
	error(payload: object, message: string): void;
}

interface CreateRateLimiterOptions {
	config: RateLimiterConfig;
	logger: RateLimitLogger;
	store: RateLimitStore | null;
}

export function createRateLimiter({
	config,
	logger,
	store,
}: CreateRateLimiterOptions): MiddlewareHandler {
	const { windowMs, maxRequests, keyPrefix = "rate-limit" } = config;

	return async (c, next) => {
		if (!store) {
			await next();
			return;
		}

		const ip =
			c.req.header("x-forwarded-for")?.split(",")[0] ??
			c.req.header("x-real-ip") ??
			"unknown";

		const key = `${keyPrefix}:${ip}`;
		const now = Date.now();
		const windowStart = now - windowMs;

		try {
			await store.zAdd(key, {
				score: now,
				value: `${now}:${crypto.randomUUID()}`,
			});
			await store.zRemRangeByScore(key, 0, windowStart);
			const requestCount = await store.zCard(key);
			await store.expire(key, Math.ceil(windowMs / MS_IN_SECOND));

			const currentCount = typeof requestCount === "number" ? requestCount : 0;

			c.set("rateLimitRemaining", Math.max(0, maxRequests - currentCount));
			c.set("rateLimitReset", Math.ceil((now + windowMs) / MS_IN_SECOND));

			if (currentCount > maxRequests) {
				logger.warn({ ip, currentCount, maxRequests }, "rate limit exceeded");
				return c.json(
					{
						success: false,
						error: {
							code: ErrorCodes.RATE_LIMIT_EXCEEDED,
							message: "Too many requests. Please try again later.",
						},
					},
					STATUS_CODES.TOO_MANY_REQUESTS,
					{
						"X-RateLimit-Limit": String(maxRequests),
						"X-RateLimit-Remaining": "0",
						"X-RateLimit-Reset": String(
							Math.ceil((now + windowMs) / MS_IN_SECOND),
						),
					},
				);
			}

			c.res.headers.set("X-RateLimit-Limit", String(maxRequests));
			c.res.headers.set(
				"X-RateLimit-Remaining",
				String(Math.max(0, maxRequests - currentCount)),
			);
			c.res.headers.set(
				"X-RateLimit-Reset",
				String(Math.ceil((now + windowMs) / MS_IN_SECOND)),
			);

			await next();
		} catch (err) {
			logger.error({ err, ip }, "rate limiter error");
			await next();
		}
	};
}
