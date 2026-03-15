import z from "zod";

export const authSearchSchema = z.object({
	callbackURL: z.string().optional(),
	token: z.string().optional(),
});

export type AuthSearch = z.infer<typeof authSearchSchema>;

export function getSafeCallbackPath(
	callbackURL?: string,
	fallback = "/dashboard",
): string {
	if (!callbackURL) {
		return fallback;
	}

	if (!callbackURL.startsWith("/") || callbackURL.startsWith("//")) {
		return fallback;
	}

	return callbackURL;
}

export function buildPathWithCallback(
	path: string,
	callbackURL?: string,
): string {
	const safeCallbackURL = getSafeCallbackPath(callbackURL, "");

	if (!safeCallbackURL) {
		return path;
	}

	const params = new URLSearchParams({
		callbackURL: safeCallbackURL,
	});

	return `${path}?${params.toString()}`;
}

export function getAuthSuccessPath(callbackURL?: string): string {
	return getSafeCallbackPath(callbackURL, "/dashboard");
}

export function getGuestRouteRedirectPath(
	hasSession: boolean,
	callbackURL?: string,
): string | null {
	if (!hasSession) {
		return null;
	}

	return getAuthSuccessPath(callbackURL);
}

export function getProtectedRouteLoginPath(callbackURL: string): string {
	return buildPathWithCallback("/login", callbackURL);
}

export function getPostResetLoginPath(callbackURL?: string): string {
	return buildPathWithCallback("/login", callbackURL);
}
