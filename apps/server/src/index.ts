import { Hono } from "hono";
import { closeCache, closeDatabase } from "./infrastructure";
import { appConfig } from "./lib/configs/app.config";
import { logger } from "./lib/utils/logger";
import { logStartup } from "./lib/utils/startup-logger";
import { corsMiddleware } from "./middleware/cors.middleware";
import { errorHandler } from "./middleware/error-handler.middleware";
import { rateLimiter } from "./middleware/rate-limiter.middleware";
import { requestLogger } from "./middleware/request-logger.middleware";
import { securityHeaders } from "./middleware/security-headers.middleware";
import { registerRoutes } from "./routes";

const startTime = Date.now();

const app = new Hono();

app.use(requestLogger);
app.use("*", securityHeaders(appConfig.security));
app.use("*", corsMiddleware);
app.use(rateLimiter(appConfig.rateLimit));
app.use(errorHandler);

registerRoutes(app);

app.get("/", (c) => {
	return c.json({ status: "ok", message: "Articys API" });
});

const signalHandler = async (signal: string) => {
	logger.info({ signal }, "received shutdown signal");
	try {
		await closeDatabase();
		await closeCache();
		logger.info("cleanup complete, exiting");
		process.exit(0);
	} catch (err) {
		logger.error({ err }, "error during shutdown");
		process.exit(1);
	}
};

process.on("SIGTERM", () => signalHandler("SIGTERM"));
process.on("SIGINT", () => signalHandler("SIGINT"));

const server = Bun.serve({
	fetch: app.fetch,
	port: appConfig.server.port,
	hostname: appConfig.server.host,
});

await logStartup(server, startTime);
