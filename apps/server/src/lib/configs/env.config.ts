import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const DEFAULT_PORT = 3000;
const MIN_AUTH_SECRET_LENGTH = 32;

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(MIN_AUTH_SECRET_LENGTH),
		BETTER_AUTH_URL: z.url(),
		CORS_ORIGIN: z.url(),
		REDIS_URL: z.string().url().optional(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
		PORT: z.coerce.number().default(DEFAULT_PORT),
		HOST: z.string().default("0.0.0.0"),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
