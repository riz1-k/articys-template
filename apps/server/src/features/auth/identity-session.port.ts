import type { CurrentSession } from "./session.types";

export interface IdentitySessionPort {
	getCurrentSession(headers: Headers): Promise<CurrentSession | null>;
}
