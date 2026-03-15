import type { Hono } from "hono";
import type { IdentitySessionService } from "@/modules/identity/application/create-identity-session-service";
import { success } from "@/platform/http/api-response";
import {
	getCurrentSession,
	getCurrentUser,
	requireAuth,
} from "@/platform/http/require-auth";

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
