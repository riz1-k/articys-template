import type { IdentitySessionPort } from "./identity-session.port";
import type { CurrentSession } from "./session.types";

export interface IdentitySessionService {
	getCurrentSession(headers: Headers): Promise<CurrentSession | null>;
}

export function createIdentitySessionService(
	identitySessionPort: IdentitySessionPort,
): IdentitySessionService {
	return {
		getCurrentSession(headers: Headers) {
			return identitySessionPort.getCurrentSession(headers);
		},
	};
}
