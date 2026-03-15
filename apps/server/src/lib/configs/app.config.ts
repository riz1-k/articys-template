import { MS_IN_SECOND, SECONDS_PER_MINUTE } from "@/lib/constants";
import { env } from "@/platform/config/env.config";

export const appConfig = {
	env: env.NODE_ENV,
	isDevelopment: env.NODE_ENV === "development",
	isProduction: env.NODE_ENV === "production",
	isTest: env.NODE_ENV === "test",

	rateLimit: {
		windowMs: SECONDS_PER_MINUTE * MS_IN_SECOND,
		maxRequests: 100,
		keyPrefix: "rl",
	},

	server: {
		port: env.PORT,
		host: env.HOST,
	},

	logging: {
		level: env.LOG_LEVEL,
	},

	database: {
		pool: {
			max: 10,
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 5000,
		},
	},

	cors: {
		origin: env.CORS_ORIGIN,
		credentials: true,
	},

	security: {
		referrerPolicy: "strict-origin-when-cross-origin",
		contentSecurityPolicy: "default-src 'self'",
	},
} as const;
