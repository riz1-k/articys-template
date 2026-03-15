import type {
	BillingCustomer,
	BillingPlan,
	BillingSubscription,
	BillingSubscriptionStatus,
} from "@/modules/billing/domain/subscription";

export interface SaveBillingCustomerInput extends BillingCustomer {}

export interface UpsertBillingSubscriptionInput {
	userId: string;
	stripeCustomerId: string;
	stripeSubscriptionId: string;
	plan: BillingPlan | null;
	stripePriceId: string | null;
	status: BillingSubscriptionStatus;
	cancelAtPeriodEnd: boolean;
	currentPeriodEnd: Date | null;
}

export interface BillingRepository {
	findCustomerByUserId(userId: string): Promise<BillingCustomer | null>;
	findCustomerByStripeCustomerId(
		stripeCustomerId: string,
	): Promise<BillingCustomer | null>;
	saveCustomer(input: SaveBillingCustomerInput): Promise<BillingCustomer>;
	findSubscriptionByUserId(userId: string): Promise<BillingSubscription | null>;
	upsertSubscription(
		input: UpsertBillingSubscriptionInput,
	): Promise<BillingSubscription>;
}
