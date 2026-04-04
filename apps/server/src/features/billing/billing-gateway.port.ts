import type {
	BillingPlan,
	BillingSubscriptionStatus,
} from "@/features/billing/subscription";

export interface CreateStripeCustomerInput {
	userId: string;
	email: string;
	name: string;
}

export interface CreateStripeCheckoutSessionInput {
	customerId: string;
	plan: BillingPlan;
	successUrl: string;
	cancelUrl: string;
}

export interface StripeSubscriptionSnapshot {
	customerId: string;
	subscriptionId: string;
	status: BillingSubscriptionStatus;
	priceId: string | null;
	cancelAtPeriodEnd: boolean;
	currentPeriodEnd: Date | null;
}

export type BillingWebhookEvent =
	| {
			type: "checkout.session.completed";
			customerId: string | null;
			subscriptionId: string | null;
	  }
	| ({
			type:
				| "customer.subscription.created"
				| "customer.subscription.updated"
				| "customer.subscription.deleted";
	  } & StripeSubscriptionSnapshot);

export interface BillingGatewayPort {
	createCustomer(input: CreateStripeCustomerInput): Promise<{ id: string }>;
	createCheckoutSession(
		input: CreateStripeCheckoutSessionInput,
	): Promise<{ url: string; id: string }>;
	createBillingPortalSession(input: {
		customerId: string;
		returnUrl: string;
	}): Promise<{ url: string }>;
	verifyAndParseWebhook(input: {
		payload: string;
		signature: string;
	}): BillingWebhookEvent;
	getPlanForPriceId(priceId: string | null): BillingPlan | null;
}
