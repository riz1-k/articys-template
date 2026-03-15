export const BILLING_PLANS = ["monthly", "yearly"] as const;
export type BillingPlan = (typeof BILLING_PLANS)[number];

export const BILLING_SUBSCRIPTION_STATUSES = [
	"inactive",
	"trialing",
	"active",
	"past_due",
	"canceled",
	"unpaid",
	"incomplete",
] as const;

export type BillingSubscriptionStatus =
	(typeof BILLING_SUBSCRIPTION_STATUSES)[number];

export interface BillingStatusDto {
	customerId: string | null;
	subscription: {
		plan: BillingPlan | null;
		status: BillingSubscriptionStatus;
		cancelAtPeriodEnd: boolean;
		currentPeriodEnd: string | null;
	} | null;
	entitlement: {
		hasActiveSubscription: boolean;
		maxTodos: number | null;
		currentTodoCount: number;
		canCreateMoreTodos: boolean;
	};
}

export interface CheckoutSessionDto {
	sessionId: string;
	url: string;
}

export interface BillingPortalSessionDto {
	url: string;
}
