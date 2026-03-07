import type { MiddlewareHandler } from "hono";

interface SecurityHeadersConfig {
	referrerPolicy?: string;
	contentSecurityPolicy?: string;
}

export function securityHeaders(
	config: SecurityHeadersConfig = {},
): MiddlewareHandler {
	const {
		referrerPolicy = "strict-origin-when-cross-origin",
		contentSecurityPolicy = "default-src 'self'",
	} = config;

	return async (c, next) => {
		c.res.headers.set("X-Content-Type-Options", "nosniff");
		c.res.headers.set("X-Frame-Options", "DENY");
		c.res.headers.set("X-XSS-Protection", "1; mode=block");
		c.res.headers.set("Referrer-Policy", referrerPolicy);
		c.res.headers.set("Content-Security-Policy", contentSecurityPolicy);
		c.res.headers.set(
			"Permissions-Policy",
			"geolocation=(), microphone=(), camera=()",
		);

		if (c.req.method === "GET" || c.req.method === "HEAD") {
			c.res.headers.set("Cache-Control", "no-store, max-age=0");
		}

		await next();
	};
}
