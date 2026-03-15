import { hasActiveSubscription } from "@/modules/billing/domain/subscription";
import {
	FREE_TODO_LIMIT,
	type TodoEntitlement,
} from "@/modules/billing/domain/todo-entitlement";
import type { BillingRepository } from "./billing.repository";
import type { TodoEntitlementPort } from "./todo-entitlement.port";

export function createTodoEntitlementService(
	billingRepository: BillingRepository,
): TodoEntitlementPort {
	return {
		async getTodoEntitlement({
			userId,
			currentTodoCount,
		}): Promise<TodoEntitlement> {
			const subscription =
				await billingRepository.findSubscriptionByUserId(userId);
			const active = subscription
				? hasActiveSubscription(subscription.status)
				: false;
			const maxTodos = active ? null : FREE_TODO_LIMIT;

			return {
				hasActiveSubscription: active,
				maxTodos,
				currentTodoCount,
				canCreateMoreTodos:
					maxTodos === null ? true : currentTodoCount < maxTodos,
			};
		},
	};
}
