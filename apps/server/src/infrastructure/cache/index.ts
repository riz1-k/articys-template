import { createClient, type RedisClientType } from "redis";
import { env } from "../../lib/configs/env.config";
import { logger } from "../../lib/utils/logger";

export const redis: RedisClientType | null = env.REDIS_URL
	? createClient({ url: env.REDIS_URL })
	: null;

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
