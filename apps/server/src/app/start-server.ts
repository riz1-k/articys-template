import {
	initializeInfrastructure,
	shutdownInfrastructure,
} from "@/infrastructure";
import { appConfig } from "@/platform/config/app.config";
import { logger } from "@/platform/observability/logger";
import { logStartup } from "@/platform/observability/startup-logger";
import { createAppDependencies } from "./composition/create-app-dependencies";
import { createApp } from "./create-app";

export async function startServer() {
	const startTime = Date.now();

	await initializeInfrastructure();

	const app = createApp(createAppDependencies());
	const server = Bun.serve({
		fetch: app.fetch,
		port: appConfig.server.port,
		hostname: appConfig.server.host,
	});

	const signalHandler = async (signal: string) => {
		logger.info({ signal }, "received shutdown signal");
		try {
			await shutdownInfrastructure();
			logger.info("cleanup complete, exiting");
			process.exit(0);
		} catch (err) {
			logger.error({ err }, "error during shutdown");
			process.exit(1);
		}
	};

	process.on("SIGTERM", () => signalHandler("SIGTERM"));
	process.on("SIGINT", () => signalHandler("SIGINT"));

	await logStartup(server, startTime);

	return server;
}
