import type { TodoEntitlement } from "@/modules/billing/domain/todo-entitlement";

export interface TodoEntitlementPort {
	getTodoEntitlement(input: {
		userId: string;
		currentTodoCount: number;
	}): Promise<TodoEntitlement>;
}
