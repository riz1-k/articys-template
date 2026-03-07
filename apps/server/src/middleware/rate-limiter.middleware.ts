import type { MiddlewareHandler } from "hono";
import { MS_IN_SECOND } from "@/lib/constants";
import { STATUS_CODES } from "@/lib/constants/status-codes";
import { redis } from "../infrastructure/cache";
import { logger } from "../lib/utils/logger";

export interface RateLimiterConfig {
	windowMs: number;
	maxRequests: number;
	keyPrefix?: string;
}

export function rateLimiter(config: RateLimiterConfig): MiddlewareHandler {
	const { windowMs, maxRequests, keyPrefix = "rate-limit" } = config;

	return async (c, next) => {
		if (!redis) {
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
			await redis.zAdd(key, { score: now, value: `${now}` });
			await redis.zRemRangeByScore(key, windowStart, windowStart);
			const requestCount = await redis.zCard(key);
			await redis.expire(key, Math.ceil(windowMs / MS_IN_SECOND));

			const currentCount = typeof requestCount === "number" ? requestCount : 0;

			c.set("rateLimitRemaining", Math.max(0, maxRequests - currentCount));
			c.set("rateLimitReset", Math.ceil((now + windowMs) / MS_IN_SECOND));

			if (currentCount > maxRequests) {
				logger.warn({ ip, currentCount, maxRequests }, "rate limit exceeded");
				return c.json(
					{
						success: false,
						error: {
							code: "RATE_LIMIT_EXCEEDED",
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
