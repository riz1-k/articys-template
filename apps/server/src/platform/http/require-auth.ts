import type { MiddlewareHandler } from "hono";
import { STATUS_CODES } from "@/lib/constants";
import type { createIdentitySessionService } from "@/modules/identity/application/create-identity-session-service";
import { AppError } from "./app-error";
import { ErrorCodes } from "./error-codes";

type IdentitySessionService = ReturnType<typeof createIdentitySessionService>;

export function requireAuth(
	identitySessionService: IdentitySessionService,
): MiddlewareHandler {
	return async (c, next) => {
		const currentSession = await identitySessionService.getCurrentSession(
			c.req.raw.headers,
		);

		if (!currentSession) {
			throw new AppError(
				STATUS_CODES.UNAUTHORIZED,
				"Authentication required",
				ErrorCodes.UNAUTHORIZED,
			);
		}

		c.set("currentUser", currentSession.user);
		c.set("currentSession", currentSession.session);

		await next();
	};
}

export function getCurrentUser(c: { get(key: "currentUser"): unknown }) {
	return c.get("currentUser") as {
		id: string;
		email: string;
		name: string;
		image?: string | null;
		emailVerified: boolean;
	};
}

export function getCurrentSession(c: { get(key: "currentSession"): unknown }) {
	return c.get("currentSession") as {
		id: string;
		userId: string;
		expiresAt: Date;
		ipAddress?: string | null;
		userAgent?: string | null;
	};
}
