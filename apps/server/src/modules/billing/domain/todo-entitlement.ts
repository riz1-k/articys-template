export const FREE_TODO_LIMIT = 5;

export interface TodoEntitlement {
	hasActiveSubscription: boolean;
	maxTodos: number | null;
	currentTodoCount: number;
	canCreateMoreTodos: boolean;
}
