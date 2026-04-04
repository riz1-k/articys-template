import type { TodoEntitlement } from "@/features/billing/todo-entitlement";

export interface TodoEntitlementPort {
	getTodoEntitlement(input: {
		userId: string;
		currentTodoCount: number;
	}): Promise<TodoEntitlement>;
}
