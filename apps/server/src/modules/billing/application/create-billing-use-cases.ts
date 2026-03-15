import type {
	BillingPlan,
	BillingSubscriptionStatus,
} from "@/modules/billing/domain/subscription";
import type { TodoEntitlement } from "@/modules/billing/domain/todo-entitlement";
import type { BillingRepository } from "./billing.repository";
import type { BillingGatewayPort } from "./billing-gateway.port";
import type { TodoCountPort } from "./todo-count.port";
import type { TodoEntitlementPort } from "./todo-entitlement.port";
import { createCreateBillingPortalSessionUseCase } from "./use-cases/create-billing-portal-session.use-case";
import { createCreateCheckoutSessionUseCase } from "./use-cases/create-checkout-session.use-case";
import { createGetBillingStatusUseCase } from "./use-cases/get-billing-status.use-case";
import { createHandleStripeWebhookUseCase } from "./use-cases/handle-stripe-webhook.use-case";

export interface BillingStatusResult {
	customerId: string | null;
	subscription: {
		plan: BillingPlan | null;
		status: BillingSubscriptionStatus;
		cancelAtPeriodEnd: boolean;
		currentPeriodEnd: string | null;
	} | null;
	entitlement: TodoEntitlement;
}

export interface BillingUseCases extends TodoEntitlementPort {
	getBillingStatus(input: { userId: string }): Promise<BillingStatusResult>;
	createCheckoutSession(input: {
		userId: string;
		email: string;
		name: string;
		plan: BillingPlan;
	}): Promise<{ sessionId: string; url: string }>;
	createBillingPortalSession(input: {
		userId: string;
	}): Promise<{ url: string }>;
	handleStripeWebhook(input: {
		payload: string;
		signature: string;
	}): Promise<void>;
}

export function createBillingUseCases({
	billingGateway,
	billingRepository,
	successUrl,
	cancelUrl,
	todoCountPort,
	todoEntitlementPort,
}: {
	billingGateway: BillingGatewayPort;
	billingRepository: BillingRepository;
	successUrl: string;
	cancelUrl: string;
	todoCountPort: TodoCountPort;
	todoEntitlementPort: TodoEntitlementPort;
}): BillingUseCases {
	return {
		getTodoEntitlement: todoEntitlementPort.getTodoEntitlement,
		getBillingStatus: createGetBillingStatusUseCase(
			billingRepository,
			todoCountPort,
			todoEntitlementPort,
		),
		createCheckoutSession: createCreateCheckoutSessionUseCase(
			billingRepository,
			billingGateway,
			{
				successUrl,
				cancelUrl,
			},
		),
		createBillingPortalSession: createCreateBillingPortalSessionUseCase(
			billingRepository,
			billingGateway,
			successUrl,
		),
		handleStripeWebhook: createHandleStripeWebhookUseCase(
			billingRepository,
			billingGateway,
		),
	};
}
