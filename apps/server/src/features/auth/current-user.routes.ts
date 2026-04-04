import type { Hono } from "hono";
import { success } from "@/core/http/api-response";
import {
	getCurrentSession,
	getCurrentUser,
	requireAuth,
} from "@/core/http/require-auth";
import type { IdentitySessionService } from "@/features/auth";

export function registerCurrentUserRoutes(
	app: Hono,
	identitySessionService: IdentitySessionService,
) {
	app.get("/api/me", requireAuth(identitySessionService), (c) => {
		return success(c, {
			user: getCurrentUser(c),
			session: getCurrentSession(c),
		});
	});
}
