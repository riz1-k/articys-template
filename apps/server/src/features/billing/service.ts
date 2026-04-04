import type {
	BillingPlan,
	BillingSubscriptionStatus,
} from "@/features/billing/subscription";
import type { TodoEntitlement } from "@/features/billing/todo-entitlement";
import type { BillingRepository } from "./billing.repository";
import type { BillingGatewayPort } from "./billing-gateway.port";
import { createCreateBillingPortalSessionUseCase } from "./create-billing-portal-session.use-case";
import { createCreateCheckoutSessionUseCase } from "./create-checkout-session.use-case";
import { createGetBillingStatusUseCase } from "./get-billing-status.use-case";
import { createHandleStripeWebhookUseCase } from "./handle-stripe-webhook.use-case";
import type { TodoCountPort } from "./todo-count.port";
import type { TodoEntitlementPort } from "./todo-entitlement.port";

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

export interface BillingService extends TodoEntitlementPort {
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

export type BillingUseCases = BillingService;

export function createBillingService({
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
}): BillingService {
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

export const createBillingUseCases = createBillingService;
