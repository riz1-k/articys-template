import type { IdentitySessionPort } from "@/features/auth/identity-session.port";
import type { createBetterAuth } from "./better-auth";

type BetterAuth = ReturnType<typeof createBetterAuth>;

export function createBetterAuthSessionPort(
	authInstance: BetterAuth,
): IdentitySessionPort {
	return {
		async getCurrentSession(headers) {
			const session = await authInstance.api.getSession({ headers });

			if (!session) {
				return null;
			}

			return {
				user: {
					id: session.user.id,
					email: session.user.email,
					name: session.user.name,
					image: session.user.image,
					emailVerified: session.user.emailVerified,
				},
				session: {
					id: session.session.id,
					userId: session.session.userId,
					expiresAt: session.session.expiresAt,
					ipAddress: session.session.ipAddress,
					userAgent: session.session.userAgent,
				},
			};
		},
	};
}
