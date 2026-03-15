import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BillingCard } from "./billing-card";

afterEach(() => {
	cleanup();
});

describe("BillingCard", () => {
	it("renders free billing status with upgrade CTAs", () => {
		render(
			<BillingCard
				status={{
					customerId: null,
					subscription: null,
					entitlement: {
						hasActiveSubscription: false,
						maxTodos: 5,
						currentTodoCount: 3,
						canCreateMoreTodos: true,
					},
				}}
				isLoading={false}
				isStartingMonthlyCheckout={false}
				isStartingYearlyCheckout={false}
				isOpeningPortal={false}
				onUpgradeMonthly={vi.fn()}
				onUpgradeYearly={vi.fn()}
				onManageBilling={vi.fn()}
			/>,
		);

		expect(screen.getByText("free")).not.toBeNull();
		expect(screen.getByText("3 / 5")).not.toBeNull();
		expect(
			screen.getByRole("button", { name: "Upgrade monthly" }),
		).not.toBeNull();
		expect(
			screen.getByRole("button", { name: "Upgrade yearly" }),
		).not.toBeNull();
	});

	it("renders subscribed billing status with a portal CTA", () => {
		const onManageBilling = vi.fn();

		render(
			<BillingCard
				status={{
					customerId: "cus_123",
					subscription: {
						plan: "yearly",
						status: "active",
						cancelAtPeriodEnd: false,
						currentPeriodEnd: "2026-04-01T00:00:00.000Z",
					},
					entitlement: {
						hasActiveSubscription: true,
						maxTodos: null,
						currentTodoCount: 8,
						canCreateMoreTodos: true,
					},
				}}
				isLoading={false}
				isStartingMonthlyCheckout={false}
				isStartingYearlyCheckout={false}
				isOpeningPortal={false}
				onUpgradeMonthly={vi.fn()}
				onUpgradeYearly={vi.fn()}
				onManageBilling={onManageBilling}
			/>,
		);

		expect(screen.getByText("yearly")).not.toBeNull();
		expect(screen.getByText("8 / unlimited")).not.toBeNull();

		fireEvent.click(screen.getByRole("button", { name: /manage billing/i }));

		expect(onManageBilling).toHaveBeenCalledOnce();
		expect(
			screen.queryByRole("button", { name: "Upgrade monthly" }),
		).toBeNull();
	});
});
