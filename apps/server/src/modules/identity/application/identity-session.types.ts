export interface AuthenticatedUser {
	id: string;
	email: string;
	name: string;
	image?: string | null;
	emailVerified: boolean;
}

export interface AuthenticatedSession {
	id: string;
	userId: string;
	expiresAt: Date;
	ipAddress?: string | null;
	userAgent?: string | null;
}

export interface CurrentSession {
	user: AuthenticatedUser;
	session: AuthenticatedSession;
}
