import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@/core/config/env.config";
import { db } from "@/core/database";
import * as schema from "@/core/database/schema/auth";
import type { AuthEmailSenderPort } from "@/features/auth/auth-email-sender.port";

const VERIFY_EMAIL_PATH = "/verify-email";
const RESET_PASSWORD_PATH = "/reset-password";
const RESET_PASSWORD_PATH_PREFIX = "/reset-password/";

export function createBetterAuth(authEmailSender: AuthEmailSenderPort) {
	return betterAuth({
		baseURL: env.BETTER_AUTH_URL,
		secret: env.BETTER_AUTH_SECRET,
		database: drizzleAdapter(db, {
			provider: "pg",
			schema,
		}),
		trustedOrigins: [env.CORS_ORIGIN],
		emailAndPassword: {
			enabled: true,
			sendResetPassword: async ({ user, url }) => {
				await authEmailSender.sendPasswordResetEmail({
					user: {
						email: user.email,
						name: user.name,
					},
					resetUrl: toFrontendAuthUrl(url, RESET_PASSWORD_PATH),
				});
			},
		},
		emailVerification: {
			sendOnSignUp: true,
			sendVerificationEmail: async ({ user, url }) => {
				await authEmailSender.sendVerificationEmail({
					user: {
						email: user.email,
						name: user.name,
					},
					verificationUrl: toFrontendAuthUrl(url, VERIFY_EMAIL_PATH),
				});
			},
		},
		advanced: {
			defaultCookieAttributes: getDefaultCookieAttributes(),
		},
		plugins: [],
	});
}

function toFrontendAuthUrl(url: string, pathname: string): string {
	const normalizedUrl = normalizeAuthUrl(url);

	try {
		const original = new URL(normalizedUrl);
		const frontend = new URL(pathname, env.CORS_ORIGIN);

		original.searchParams.forEach((value, key) => {
			frontend.searchParams.set(key, value);
		});

		if (
			original.pathname.startsWith(RESET_PASSWORD_PATH_PREFIX) &&
			!frontend.searchParams.has("token")
		) {
			const token = original.pathname.slice(RESET_PASSWORD_PATH_PREFIX.length);
			if (token) {
				frontend.searchParams.set("token", token);
			}
		}

		return frontend.toString();
	} catch {
		return normalizedUrl;
	}
}

function normalizeAuthUrl(url: string): string {
	try {
		const base = new URL(env.BETTER_AUTH_URL);
		const resolved = new URL(url, base);

		resolved.protocol = base.protocol;
		resolved.host = base.host;

		return resolved.toString();
	} catch {
		return url;
	}
}

function getDefaultCookieAttributes(): {
	sameSite: "lax" | "none";
	secure: boolean;
	httpOnly: true;
} {
	try {
		const authOrigin = new URL(env.BETTER_AUTH_URL);
		const frontendOrigin = new URL(env.CORS_ORIGIN);
		const isHttps = authOrigin.protocol === "https:";
		const isCrossOrigin = authOrigin.origin !== frontendOrigin.origin;

		return {
			sameSite: isHttps && isCrossOrigin ? "none" : "lax",
			secure: isHttps,
			httpOnly: true,
		};
	} catch {
		return {
			sameSite: "lax",
			secure: false,
			httpOnly: true,
		};
	}
}
