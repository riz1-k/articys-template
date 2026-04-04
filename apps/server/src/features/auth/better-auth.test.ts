import { describe, expect, it, vi } from "vitest";

const { betterAuthMock, drizzleAdapterMock, betterAuthSecret } = vi.hoisted(
	() => ({
		betterAuthMock: vi.fn((options) => ({ options })),
		drizzleAdapterMock: vi.fn(() => "adapter"),
		betterAuthSecret: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
	}),
);

vi.mock("better-auth", () => ({
	betterAuth: betterAuthMock,
}));

vi.mock("better-auth/adapters/drizzle", () => ({
	drizzleAdapter: drizzleAdapterMock,
}));

vi.mock("@/core/config/env.config", () => ({
	env: {
		BETTER_AUTH_SECRET: betterAuthSecret,
		BETTER_AUTH_URL: "https://api.example.com",
		CORS_ORIGIN: "https://app.example.com",
	},
}));

vi.mock("@/core/database", () => ({
	db: {},
}));

import { createBetterAuth } from "./better-auth";

describe("better-auth infrastructure", () => {
	it("configures secure cross-origin cookies for https deployments", () => {
		const auth = createBetterAuth({
			sendPasswordResetEmail: vi.fn(),
			sendVerificationEmail: vi.fn(),
		});

		expect(auth.options.advanced.defaultCookieAttributes).toEqual({
			sameSite: "none",
			secure: true,
			httpOnly: true,
		});
	});

	it("rewrites verification URLs to frontend links", async () => {
		const sendVerificationEmail = vi.fn();
		const auth = createBetterAuth({
			sendPasswordResetEmail: vi.fn(),
			sendVerificationEmail,
		});

		await auth.options.emailVerification.sendVerificationEmail({
			user: {
				id: "user-1",
				email: "test@example.com",
				emailVerified: false,
				name: "Test User",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			url: "http://internal-host/verify-email?token=abc&callbackURL=%2Fdashboard",
			token: "abc",
		});

		expect(sendVerificationEmail).toHaveBeenCalledWith({
			user: {
				email: "test@example.com",
				name: "Test User",
			},
			verificationUrl:
				"https://app.example.com/verify-email?token=abc&callbackURL=%2Fdashboard",
		});
	});

	it("rewrites reset-password URLs to frontend links and preserves the token", async () => {
		const sendPasswordResetEmail = vi.fn();
		const auth = createBetterAuth({
			sendPasswordResetEmail,
			sendVerificationEmail: vi.fn(),
		});

		await auth.options.emailAndPassword.sendResetPassword({
			user: {
				id: "user-1",
				email: "test@example.com",
				emailVerified: false,
				name: "Test User",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			url: "http://internal-host/reset-password/reset-token?callbackURL=%2Fdashboard",
			token: "reset-token",
		});

		expect(sendPasswordResetEmail).toHaveBeenCalledWith({
			user: {
				email: "test@example.com",
				name: "Test User",
			},
			resetUrl:
				"https://app.example.com/reset-password?callbackURL=%2Fdashboard&token=reset-token",
		});
	});
});
