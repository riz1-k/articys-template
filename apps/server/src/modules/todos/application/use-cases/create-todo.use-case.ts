import type { TodoEntitlementPort } from "@/modules/billing/application/todo-entitlement.port";
import { TodoLimitExceededError } from "@/modules/todos/domain/todo-limit-exceeded.error";
import type { CreateTodoInput, TodoRepository } from "../todo.repository";

export function createCreateTodoUseCase(
	todoRepository: TodoRepository,
	todoEntitlementPort: TodoEntitlementPort,
) {
	return async (input: CreateTodoInput) => {
		const currentTodoCount = await todoRepository.countByUserId(input.userId);
		const entitlement = await todoEntitlementPort.getTodoEntitlement({
			userId: input.userId,
			currentTodoCount,
		});

		if (!entitlement.canCreateMoreTodos) {
			throw new TodoLimitExceededError(
				entitlement.maxTodos ?? currentTodoCount,
			);
		}

		return todoRepository.create(input);
	};
}
