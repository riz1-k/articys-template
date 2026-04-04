import { describe, expect, it, vi } from "vitest";
import { createCreateCheckoutSessionUseCase } from "./create-checkout-session.use-case";

describe("createCreateCheckoutSessionUseCase", () => {
	it("creates a Stripe customer when one does not exist", async () => {
		const billingRepository = {
			findCustomerByUserId: vi.fn(async () => null),
			saveCustomer: vi.fn(async (input) => input),
		};
		const billingGateway = {
			createCustomer: vi.fn(async () => ({ id: "cus_123" })),
			createCheckoutSession: vi.fn(async () => ({
				id: "cs_123",
				url: "https://checkout.stripe.com/c/pay/cs_123",
			})),
		};
		const useCase = createCreateCheckoutSessionUseCase(
			billingRepository as never,
			billingGateway as never,
			{
				successUrl: "https://app.example.com/billing/success",
				cancelUrl: "https://app.example.com/billing/cancel",
			},
		);

		const result = await useCase({
			userId: "user-1",
			email: "test@example.com",
			name: "Test User",
			plan: "monthly",
		});

		expect(billingGateway.createCustomer).toHaveBeenCalledOnce();
		expect(billingGateway.createCheckoutSession).toHaveBeenCalledWith({
			customerId: "cus_123",
			plan: "monthly",
			successUrl: "https://app.example.com/billing/success",
			cancelUrl: "https://app.example.com/billing/cancel",
		});
		expect(result).toEqual({
			sessionId: "cs_123",
			url: "https://checkout.stripe.com/c/pay/cs_123",
		});
	});
});
