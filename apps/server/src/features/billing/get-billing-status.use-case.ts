import type { BillingRepository } from "@/features/billing/billing.repository";
import type { TodoCountPort } from "@/features/billing/todo-count.port";
import type { TodoEntitlementPort } from "@/features/billing/todo-entitlement.port";

export function createGetBillingStatusUseCase(
	billingRepository: BillingRepository,
	todoCountPort: TodoCountPort,
	todoEntitlementPort: TodoEntitlementPort,
) {
	return async ({ userId }: { userId: string }) => {
		const [customer, subscription, currentTodoCount] = await Promise.all([
			billingRepository.findCustomerByUserId(userId),
			billingRepository.findSubscriptionByUserId(userId),
			todoCountPort.countTodosByUserId(userId),
		]);
		const entitlement = await todoEntitlementPort.getTodoEntitlement({
			userId,
			currentTodoCount,
		});

		return {
			customerId: customer?.stripeCustomerId ?? null,
			subscription: subscription
				? {
						plan: subscription.plan,
						status: subscription.status,
						cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
						currentPeriodEnd:
							subscription.currentPeriodEnd?.toISOString() ?? null,
					}
				: null,
			entitlement,
		};
	};
}
