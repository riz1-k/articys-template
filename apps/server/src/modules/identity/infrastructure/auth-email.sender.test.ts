import { describe, expect, it, vi } from "vitest";
import { createAuthEmailSender } from "./auth-email.sender";

describe("createAuthEmailSender", () => {
	it("builds a verification email through the shared delivery port", async () => {
		const send = vi.fn();
		const authEmailSender = createAuthEmailSender({
			emailDelivery: {
				send,
			},
			from: "Articys <no-reply@example.com>",
			replyTo: "support@example.com",
			isProduction: true,
		});

		await authEmailSender.sendVerificationEmail({
			user: {
				email: "test@example.com",
				name: "Test User",
			},
			verificationUrl: "https://app.example.com/verify-email?token=abc",
		});

		expect(send).toHaveBeenCalledWith(
			expect.objectContaining({
				from: "Articys <no-reply@example.com>",
				to: "test@example.com",
				replyTo: "support@example.com",
				subject: "Verify your Articys email",
				text: expect.stringContaining(
					"https://app.example.com/verify-email?token=abc",
				),
				html: expect.stringContaining("Verify your email"),
			}),
		);
	});

	it("builds a password reset email through the shared delivery port", async () => {
		const send = vi.fn();
		const authEmailSender = createAuthEmailSender({
			emailDelivery: {
				send,
			},
			from: "Articys <no-reply@example.com>",
			isProduction: false,
		});

		await authEmailSender.sendPasswordResetEmail({
			user: {
				email: "test@example.com",
				name: "Test User",
			},
			resetUrl: "https://app.example.com/reset-password?token=abc",
		});

		expect(send).toHaveBeenCalledWith(
			expect.objectContaining({
				subject: "Reset your Articys password",
				text: expect.stringContaining(
					"https://app.example.com/reset-password?token=abc",
				),
				html: expect.stringContaining("Reset your password"),
			}),
		);
	});

	it("fails fast in production when EMAIL_FROM is not configured", () => {
		expect(() =>
			createAuthEmailSender({
				emailDelivery: {
					send: vi.fn(),
				},
				isProduction: true,
			}),
		).toThrow(
			"Auth email sender is not configured for production. Configure EMAIL_FROM.",
		);
	});
});
