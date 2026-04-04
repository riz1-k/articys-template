import type { MiddlewareHandler } from "hono";
import type { IdentitySessionService } from "@/features/auth";
import type {
	AuthenticatedSession,
	AuthenticatedUser,
} from "@/features/auth/session.types";
import { STATUS_CODES } from "@/lib/constants";
import { AppError } from "./app-error";
import { ErrorCodes } from "./error-codes";

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
	return c.get("currentUser") as AuthenticatedUser;
}

export function getCurrentSession(c: { get(key: "currentSession"): unknown }) {
	return c.get("currentSession") as AuthenticatedSession;
}
