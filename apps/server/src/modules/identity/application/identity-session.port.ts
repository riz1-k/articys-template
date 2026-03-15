import type { CurrentSession } from "./identity-session.types";

export interface IdentitySessionPort {
	getCurrentSession(headers: Headers): Promise<CurrentSession | null>;
}
