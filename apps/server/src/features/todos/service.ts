import { AppError } from "@/core/http/app-error";
import { ErrorCodes } from "@/core/http/error-codes";
import type { TodoEntitlementPort } from "@/features/billing/todo-entitlement.port";
import { STATUS_CODES } from "@/lib/constants";
import type { Todo } from "./todo";
import type { TodoRepository } from "./todo.repository";

export interface TodoService {
	createTodo(input: {
		userId: string;
		title: string;
		description?: string | null;
	}): Promise<Todo>;
	deleteTodo(input: { id: string; userId: string }): Promise<boolean>;
	getTodo(input: { id: string; userId: string }): Promise<Todo | null>;
	listTodos(input: { userId: string }): Promise<Todo[]>;
	updateTodo(input: {
		id: string;
		userId: string;
		title?: string;
		description?: string | null;
		completed?: boolean;
	}): Promise<Todo | null>;
}

export type TodoUseCases = TodoService;

export function createTodoService(
	todoRepository: TodoRepository,
	todoEntitlementPort: TodoEntitlementPort,
): TodoService {
	return {
		async createTodo(input) {
			const currentTodoCount = await todoRepository.countByUserId(input.userId);
			const entitlement = await todoEntitlementPort.getTodoEntitlement({
				userId: input.userId,
				currentTodoCount,
			});

			if (!entitlement.canCreateMoreTodos) {
				throw new AppError(
					STATUS_CODES.FORBIDDEN,
					`Free plan users can only create up to ${entitlement.maxTodos ?? currentTodoCount} todos`,
					ErrorCodes.SUBSCRIPTION_REQUIRED,
					{
						maxTodos: entitlement.maxTodos ?? currentTodoCount,
					},
				);
			}

			return todoRepository.create(input);
		},
		deleteTodo: ({ id, userId }) => todoRepository.delete(id, userId),
		getTodo: ({ id, userId }) => todoRepository.findById(id, userId),
		listTodos: ({ userId }) => todoRepository.listByUserId(userId),
		updateTodo: (input) => todoRepository.update(input),
	};
}

export const createTodoUseCases = createTodoService;
