import type { Hono } from "hono";
import type { AppContext } from "./create-context";

export function registerFeatures(
	app: Hono,
	context: Pick<AppContext, "features">,
) {
	context.features.health.register(app);
	context.features.auth.register(app);
	context.features.billing.register(app);
	context.features.shipping.register(app);
	context.features.todos.register(app);
}
