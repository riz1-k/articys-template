import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const DEFAULT_PORT = 3000;
const MIN_AUTH_SECRET_LENGTH = 32;
export const NODE_ENVIRONMENTS = ["development", "production", "test"] as const;
export const LOG_LEVELS = ["debug", "info", "warn", "error"] as const;

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(MIN_AUTH_SECRET_LENGTH),
		BETTER_AUTH_URL: z.url(),
		CORS_ORIGIN: z.url(),
		REDIS_URL: z.string().url().optional(),
		NODE_ENV: z.enum(NODE_ENVIRONMENTS).default("development"),
		LOG_LEVEL: z.enum(LOG_LEVELS).default("info"),
		PORT: z.coerce.number().default(DEFAULT_PORT),
		HOST: z.string().default("0.0.0.0"),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
