import { describe, expect, it } from "vitest";
import { FREE_TODO_LIMIT } from "@/features/billing/todo-entitlement";
import { createTodoEntitlementService } from "./entitlements";

describe("createTodoEntitlementService", () => {
	it("caps free users at five todos", async () => {
		const service = createTodoEntitlementService({
			findCustomerByUserId: async () => null,
			findCustomerByStripeCustomerId: async () => null,
			saveCustomer: async (input) => input,
			findSubscriptionByUserId: async () => null,
			upsertSubscription: async (input) => ({
				...input,
				plan: input.plan,
				stripePriceId: input.stripePriceId,
				status: input.status,
				cancelAtPeriodEnd: input.cancelAtPeriodEnd,
				currentPeriodEnd: input.currentPeriodEnd,
			}),
		});

		await expect(
			service.getTodoEntitlement({
				userId: "user-1",
				currentTodoCount: FREE_TODO_LIMIT,
			}),
		).resolves.toEqual({
			hasActiveSubscription: false,
			maxTodos: FREE_TODO_LIMIT,
			currentTodoCount: FREE_TODO_LIMIT,
			canCreateMoreTodos: false,
		});
	});

	it("removes the cap for active subscribers", async () => {
		const service = createTodoEntitlementService({
			findCustomerByUserId: async () => null,
			findCustomerByStripeCustomerId: async () => null,
			saveCustomer: async (input) => input,
			findSubscriptionByUserId: async () => ({
				userId: "user-1",
				stripeCustomerId: "cus_123",
				stripeSubscriptionId: "sub_123",
				plan: "monthly",
				stripePriceId: "price_monthly",
				status: "active",
				cancelAtPeriodEnd: false,
				currentPeriodEnd: new Date("2026-01-01T00:00:00.000Z"),
			}),
			upsertSubscription: async (input) => ({
				...input,
				plan: input.plan,
				stripePriceId: input.stripePriceId,
				status: input.status,
				cancelAtPeriodEnd: input.cancelAtPeriodEnd,
				currentPeriodEnd: input.currentPeriodEnd,
			}),
		});

		await expect(
			service.getTodoEntitlement({
				userId: "user-1",
				currentTodoCount: 12,
			}),
		).resolves.toEqual({
			hasActiveSubscription: true,
			maxTodos: null,
			currentTodoCount: 12,
			canCreateMoreTodos: true,
		});
	});
});
