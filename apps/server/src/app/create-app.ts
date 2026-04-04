import { Hono } from "hono";
import { errorHandler } from "@/core/http/error-handler";
import type { AppContext } from "./create-context";
import { registerFeatures } from "./register-features";

export type { AppContext } from "./create-context";

export function createApp(context: AppContext) {
	const app = new Hono();

	app.use(context.http.requestLogger);
	app.use("*", context.http.securityHeaders);
	app.use("*", context.http.cors);
	app.use(context.http.rateLimiter);
	app.onError(errorHandler);

	registerFeatures(app, context);

	app.get("/", (c) => {
		return c.json({ status: "ok", message: "Articys API" });
	});

	return app;
}
