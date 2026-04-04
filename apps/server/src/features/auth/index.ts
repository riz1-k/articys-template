import type { Hono } from "hono";
import { appConfig } from "@/core/config/app.config";
import { env } from "@/core/config/env.config";
import { createEmailDelivery } from "@/core/email/create-email-delivery";
import { logger } from "@/core/observability/logger";
import { registerAuthRoutes } from "./auth.routes";
import { createAuthEmailSender } from "./auth-email.sender";
import type { AuthHandler } from "./auth-handler";
import { createBetterAuth } from "./better-auth";
import { createBetterAuthSessionPort } from "./better-auth-session";
import { registerCurrentUserRoutes } from "./current-user.routes";
import {
	createIdentitySessionService,
	type IdentitySessionService,
} from "./session-service";

export type { AuthHandler } from "./auth-handler";
export type { IdentitySessionService } from "./session-service";

export interface AuthFeature {
	auth: AuthHandler;
	register(app: Hono): void;
	sessionService: IdentitySessionService;
}

export function createAuthFeature(): AuthFeature {
	const emailDelivery = createEmailDelivery({
		logger,
		isProduction: appConfig.isProduction,
		resendApiKey: env.RESEND_API_KEY,
	});
	const authEmailSender = createAuthEmailSender({
		emailDelivery,
		from: env.EMAIL_FROM,
		replyTo: env.EMAIL_REPLY_TO,
		isProduction: appConfig.isProduction,
	});
	const auth = createBetterAuth(authEmailSender);
	const sessionService = createIdentitySessionService(
		createBetterAuthSessionPort(auth),
	);

	return {
		auth,
		sessionService,
		register(app) {
			registerAuthRoutes(app, auth);
			registerCurrentUserRoutes(app, sessionService);
		},
	};
}
