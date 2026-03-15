import type { BillingRepository } from "@/modules/billing/application/billing.repository";
import type {
	BillingGatewayPort,
	BillingWebhookEvent,
} from "@/modules/billing/application/billing-gateway.port";

export function createHandleStripeWebhookUseCase(
	billingRepository: BillingRepository,
	billingGateway: BillingGatewayPort,
) {
	return async ({
		payload,
		signature,
	}: {
		payload: string;
		signature: string;
	}) => {
		const event = billingGateway.verifyAndParseWebhook({ payload, signature });

		if (event.type === "checkout.session.completed") {
			return;
		}

		await syncSubscriptionEvent(billingRepository, billingGateway, event);
	};
}

async function syncSubscriptionEvent(
	billingRepository: BillingRepository,
	billingGateway: BillingGatewayPort,
	event: Exclude<BillingWebhookEvent, { type: "checkout.session.completed" }>,
) {
	const customer = await billingRepository.findCustomerByStripeCustomerId(
		event.customerId,
	);

	if (!customer) {
		return;
	}

	await billingRepository.upsertSubscription({
		userId: customer.userId,
		stripeCustomerId: event.customerId,
		stripeSubscriptionId: event.subscriptionId,
		plan: billingGateway.getPlanForPriceId(event.priceId),
		stripePriceId: event.priceId,
		status: event.status,
		cancelAtPeriodEnd: event.cancelAtPeriodEnd,
		currentPeriodEnd: event.currentPeriodEnd,
	});
}
