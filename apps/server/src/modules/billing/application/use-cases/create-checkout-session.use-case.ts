import type { BillingRepository } from "@/modules/billing/application/billing.repository";
import type { BillingGatewayPort } from "@/modules/billing/application/billing-gateway.port";
import type { BillingPlan } from "@/modules/billing/domain/subscription";

export function createCreateCheckoutSessionUseCase(
	billingRepository: BillingRepository,
	billingGateway: BillingGatewayPort,
	urls: {
		successUrl: string;
		cancelUrl: string;
	},
) {
	return async (input: {
		userId: string;
		email: string;
		name: string;
		plan: BillingPlan;
	}) => {
		const existingCustomer = await billingRepository.findCustomerByUserId(
			input.userId,
		);
		const customer = existingCustomer
			? existingCustomer
			: await billingRepository.saveCustomer({
					userId: input.userId,
					stripeCustomerId: (
						await billingGateway.createCustomer({
							userId: input.userId,
							email: input.email,
							name: input.name,
						})
					).id,
				});

		const session = await billingGateway.createCheckoutSession({
			customerId: customer.stripeCustomerId,
			plan: input.plan,
			successUrl: urls.successUrl,
			cancelUrl: urls.cancelUrl,
		});

		return {
			sessionId: session.id,
			url: session.url,
		};
	};
}
