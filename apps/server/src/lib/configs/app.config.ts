import { env } from "./env.config";

export const appConfig = {
	env: env.NODE_ENV,
	isDevelopment: env.NODE_ENV === "development",
	isProduction: env.NODE_ENV === "production",
	isTest: env.NODE_ENV === "test",

	rateLimit: {
		windowMs: 60 * 1000,
		maxRequests: 100,
		keyPrefix: "rl",
	},

	server: {
		port: Number.parseInt(process.env.PORT ?? "3000", 10),
		host: process.env.HOST ?? "0.0.0.0",
	},

	logging: {
		level:
			process.env.LOG_LEVEL ??
			(env.NODE_ENV === "production" ? "info" : "debug"),
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
