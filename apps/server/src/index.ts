import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors.middleware";
import { requestLogger } from "./middleware/request-logger.middleware";
import { registerAuthRoutes } from "./routes/auth.routes";
import "./infrastructure";

const app = new Hono();

app.use(requestLogger);
app.use("/*", corsMiddleware);

registerAuthRoutes(app);

app.get("/", (c) => {
	return c.text("OK");
});

export default app;
