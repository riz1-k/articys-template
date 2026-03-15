import type { IdentitySessionPort } from "./identity-session.port";

export function createIdentitySessionService(
	identitySessionPort: IdentitySessionPort,
) {
	return {
		getCurrentSession(headers: Headers) {
			return identitySessionPort.getCurrentSession(headers);
		},
	};
}
