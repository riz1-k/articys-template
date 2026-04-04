import { describe, expect, it, vi } from "vitest";
import { createHandleStripeWebhookUseCase } from "./handle-stripe-webhook.use-case";

describe("createHandleStripeWebhookUseCase", () => {
	it("upserts subscription state for known Stripe customers", async () => {
		const billingRepository = {
			findCustomerByStripeCustomerId: vi.fn(async () => ({
				userId: "user-1",
				stripeCustomerId: "cus_123",
			})),
			upsertSubscription: vi.fn(async (input) => ({
				...input,
				plan: input.plan,
				stripePriceId: input.stripePriceId,
				status: input.status,
				cancelAtPeriodEnd: input.cancelAtPeriodEnd,
				currentPeriodEnd: input.currentPeriodEnd,
			})),
		};
		const billingGateway = {
			verifyAndParseWebhook: vi.fn(() => ({
				type: "customer.subscription.updated" as const,
				customerId: "cus_123",
				subscriptionId: "sub_123",
				status: "active" as const,
				priceId: "price_monthly",
				cancelAtPeriodEnd: false,
				currentPeriodEnd: new Date("2026-01-01T00:00:00.000Z"),
			})),
			getPlanForPriceId: vi.fn(() => "monthly" as const),
		};
		const useCase = createHandleStripeWebhookUseCase(
			billingRepository as never,
			billingGateway as never,
		);

		await useCase({
			payload: "{}",
			signature: "t=123,v1=abc",
		});

		expect(billingRepository.upsertSubscription).toHaveBeenCalledWith({
			userId: "user-1",
			stripeCustomerId: "cus_123",
			stripeSubscriptionId: "sub_123",
			plan: "monthly",
			stripePriceId: "price_monthly",
			status: "active",
			cancelAtPeriodEnd: false,
			currentPeriodEnd: new Date("2026-01-01T00:00:00.000Z"),
		});
	});

	it("ignores subscription events for unknown customers", async () => {
		const billingRepository = {
			findCustomerByStripeCustomerId: vi.fn(async () => null),
			upsertSubscription: vi.fn(),
		};
		const billingGateway = {
			verifyAndParseWebhook: vi.fn(() => ({
				type: "customer.subscription.deleted" as const,
				customerId: "cus_missing",
				subscriptionId: "sub_123",
				status: "canceled" as const,
				priceId: "price_monthly",
				cancelAtPeriodEnd: false,
				currentPeriodEnd: null,
			})),
			getPlanForPriceId: vi.fn(() => "monthly" as const),
		};
		const useCase = createHandleStripeWebhookUseCase(
			billingRepository as never,
			billingGateway as never,
		);

		await useCase({
			payload: "{}",
			signature: "t=123,v1=abc",
		});

		expect(billingRepository.upsertSubscription).not.toHaveBeenCalled();
	});
});
