import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		CORS_ORIGIN: z.url(),
		REDIS_URL: z.string().url().optional(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
		PORT: z.coerce.number().default(3000),
		HOST: z.string().default("0.0.0.0"),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
