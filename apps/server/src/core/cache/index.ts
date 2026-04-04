import { createClient, type RedisClientType } from "redis";
import { env } from "@/core/config/env.config";
import { logger } from "@/core/observability/logger";

export const redis: RedisClientType | null = env.REDIS_URL
	? createClient({ url: env.REDIS_URL })
	: null;

export function isCacheConfigured(): boolean {
	return redis != null;
}

if (redis) {
	redis.on("error", (err) => {
		logger.error({ err }, "Redis client error");
	});
}

export async function connectCache(): Promise<void> {
	if (redis) {
		await redis.connect();
		logger.info("Redis connected");
	}
}

export async function pingCache(): Promise<boolean> {
	if (!redis) return false;
	try {
		await redis.ping();
		return true;
	} catch {
		return false;
	}
}

export async function closeCache(): Promise<void> {
	if (redis) {
		await redis.quit();
	}
}
