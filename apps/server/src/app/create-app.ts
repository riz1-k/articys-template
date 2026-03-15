import { Hono } from "hono";
import { errorHandler } from "@/platform/http/error-handler";
import type { AppDependencies } from "./app-dependencies";
import { createAppDependencies } from "./composition/create-app-dependencies";
import { registerRoutes } from "./register-routes";

export type { AppDependencies } from "./app-dependencies";

export function createApp(
	dependencies: AppDependencies = createAppDependencies(),
) {
	const app = new Hono();

	app.use(dependencies.http.requestLogger);
	app.use("*", dependencies.http.securityHeaders);
	app.use("*", dependencies.http.cors);
	app.use(dependencies.http.rateLimiter);
	app.onError(errorHandler);

	registerRoutes(app, dependencies);

	app.get("/", (c) => {
		return c.json({ status: "ok", message: "Articys API" });
	});

	return app;
}
