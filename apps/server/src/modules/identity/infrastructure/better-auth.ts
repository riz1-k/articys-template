import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { Logger } from "pino";
import { db } from "@/infrastructure/database";
import * as schema from "@/infrastructure/database/schema/auth";
import { env } from "@/platform/config/env.config";

const VERIFY_EMAIL_PATH = "/verify-email";
const RESET_PASSWORD_PATH = "/reset-password";
const RESET_PASSWORD_PATH_PREFIX = "/reset-password/";

interface BetterAuthEmailSender {
	sendPasswordResetEmail(input: {
		user: {
			email: string;
			name: string;
		};
		resetUrl: string;
	}): Promise<void>;
	sendVerificationEmail(input: {
		user: {
			email: string;
			name: string;
		};
		verificationUrl: string;
	}): Promise<void>;
}

export function createBetterAuth(authEmailSender: BetterAuthEmailSender) {
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

export function createLoggingAuthEmailSender(input: {
	logger: Pick<Logger, "info">;
	isProduction: boolean;
}): BetterAuthEmailSender {
	if (input.isProduction) {
		throw new Error(
			"Auth email delivery is not configured for production. Replace the logging auth email sender with a real provider before starting the server.",
		);
	}

	return {
		async sendPasswordResetEmail({ user, resetUrl }) {
			input.logger.info(
				{
					event: "auth.password_reset_email",
					email: user.email,
					name: user.name,
					resetUrl,
				},
				"Password reset email queued for logging transport",
			);
		},
		async sendVerificationEmail({ user, verificationUrl }) {
			input.logger.info(
				{
					event: "auth.verification_email",
					email: user.email,
					name: user.name,
					verificationUrl,
				},
				"Verification email queued for logging transport",
			);
		},
	};
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
