import { beforeEach, describe, expect, it, vi } from "vitest";

const { resendSendMock, resendConstructorMock } = vi.hoisted(() => ({
	resendSendMock: vi.fn(),
	resendConstructorMock: vi.fn(function Resend(this: {
		emails: { send: typeof resendSendMock };
	}) {
		this.emails = {
			send: resendSendMock,
		};
	}),
}));

vi.mock("resend", () => ({
	Resend: resendConstructorMock,
}));

import { createEmailDelivery } from "./create-email-delivery";

describe("createEmailDelivery", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		resendSendMock.mockResolvedValue({
			data: {
				id: "email-1",
			},
			error: null,
		});
	});

	it("uses the logging transport outside production when Resend is not configured", async () => {
		const logger = {
			info: vi.fn(),
		};
		const emailDelivery = createEmailDelivery({
			logger,
			isProduction: false,
		});

		await emailDelivery.send({
			from: "Articys <no-reply@example.com>",
			to: "test@example.com",
			subject: "Test",
			html: "<p>Test</p>",
			text: "Test",
		});

		expect(logger.info).toHaveBeenCalledWith(
			expect.objectContaining({
				event: "email.delivery.logging",
				to: "test@example.com",
				subject: "Test",
			}),
			"Email queued for logging transport",
		);
		expect(resendConstructorMock).not.toHaveBeenCalled();
	});

	it("fails fast in production when Resend is not configured", () => {
		expect(() =>
			createEmailDelivery({
				logger: {
					info: vi.fn(),
				},
				isProduction: true,
			}),
		).toThrow(
			"Email delivery is not configured for production. Configure RESEND_API_KEY.",
		);
	});

	it("uses the Resend transport when an API key is configured", async () => {
		const emailDelivery = createEmailDelivery({
			logger: {
				info: vi.fn(),
			},
			isProduction: true,
			resendApiKey: "re_test_123",
		});

		await emailDelivery.send({
			from: "Articys <no-reply@example.com>",
			to: "test@example.com",
			subject: "Test",
			html: "<p>Test</p>",
			text: "Test",
			replyTo: "support@example.com",
		});

		expect(resendConstructorMock).toHaveBeenCalledWith("re_test_123");
		expect(resendSendMock).toHaveBeenCalledWith({
			from: "Articys <no-reply@example.com>",
			to: "test@example.com",
			subject: "Test",
			html: "<p>Test</p>",
			text: "Test",
			replyTo: "support@example.com",
		});
	});
});
