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
	}
}
