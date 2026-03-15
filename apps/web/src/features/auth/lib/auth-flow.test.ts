import { describe, expect, it } from "vitest";
import {
	authSearchSchema,
	buildPathWithCallback,
	getAuthSuccessPath,
	getGuestRouteRedirectPath,
	getPostResetLoginPath,
	getProtectedRouteLoginPath,
	getSafeCallbackPath,
} from "./auth-flow";

describe("auth-flow helpers", () => {
	it("accepts known auth query parameters", () => {
		expect(
			authSearchSchema.parse({
				callbackURL: "/dashboard",
				token: "abc123",
			}),
		).toEqual({
			callbackURL: "/dashboard",
			token: "abc123",
		});
	});

	it("falls back when callbackURL is missing or unsafe", () => {
		expect(getSafeCallbackPath(undefined)).toBe("/dashboard");
		expect(getSafeCallbackPath("https://example.com")).toBe("/dashboard");
		expect(getSafeCallbackPath("//evil.example")).toBe("/dashboard");
	});

	it("preserves safe relative callback paths", () => {
		expect(getSafeCallbackPath("/dashboard?tab=recent")).toBe(
			"/dashboard?tab=recent",
		);
		expect(getAuthSuccessPath("/todos#active")).toBe("/todos#active");
	});

	it("builds callback-aware auth links", () => {
		expect(buildPathWithCallback("/login", "/dashboard")).toBe(
			"/login?callbackURL=%2Fdashboard",
		);
		expect(getProtectedRouteLoginPath("/dashboard")).toBe(
			"/login?callbackURL=%2Fdashboard",
		);
		expect(getPostResetLoginPath("/dashboard")).toBe(
			"/login?callbackURL=%2Fdashboard",
		);
	});

	it("redirects signed-in users away from guest pages", () => {
		expect(getGuestRouteRedirectPath(false, "/dashboard")).toBeNull();
		expect(getGuestRouteRedirectPath(true, "/dashboard")).toBe("/dashboard");
		expect(getGuestRouteRedirectPath(true, "https://example.com")).toBe(
			"/dashboard",
		);
	});
});
