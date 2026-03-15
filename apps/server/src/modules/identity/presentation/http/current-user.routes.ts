import type { Hono } from "hono";
import type { createIdentitySessionService } from "@/modules/identity/application/create-identity-session-service";
import { success } from "@/platform/http/api-response";
import {
	getCurrentSession,
	getCurrentUser,
	requireAuth,
} from "@/platform/http/require-auth";

type IdentitySessionService = ReturnType<typeof createIdentitySessionService>;

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
