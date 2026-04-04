import { cors } from "hono/cors";

interface CorsConfig {
	origin: string;
	credentials: boolean;
}

export function createCorsMiddleware(config: CorsConfig) {
	return cors({
		origin: config.origin,
		allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
		credentials: config.credentials,
	});
}
