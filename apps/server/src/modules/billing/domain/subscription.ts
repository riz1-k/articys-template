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

export interface BillingCustomer {
	userId: string;
	stripeCustomerId: string;
}

export interface BillingSubscription {
	userId: string;
	stripeCustomerId: string;
	stripeSubscriptionId: string;
	plan: BillingPlan | null;
	stripePriceId: string | null;
	status: BillingSubscriptionStatus;
	cancelAtPeriodEnd: boolean;
	currentPeriodEnd: Date | null;
}

export function hasActiveSubscription(
	status: BillingSubscriptionStatus,
): boolean {
	return status === "active" || status === "trialing";
}
