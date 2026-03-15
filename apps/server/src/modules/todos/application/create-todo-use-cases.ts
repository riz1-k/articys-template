import type { TodoEntitlementPort } from "@/modules/billing/application/todo-entitlement.port";
import type { Todo } from "@/modules/todos/domain/todo";
import type { TodoRepository } from "./todo.repository";
import { createCreateTodoUseCase } from "./use-cases/create-todo.use-case";
import { createDeleteTodoUseCase } from "./use-cases/delete-todo.use-case";
import { createGetTodoUseCase } from "./use-cases/get-todo.use-case";
import { createListTodosUseCase } from "./use-cases/list-todos.use-case";
import { createUpdateTodoUseCase } from "./use-cases/update-todo.use-case";

export interface TodoUseCases {
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

export function createTodoUseCases(
	todoRepository: TodoRepository,
	todoEntitlementPort: TodoEntitlementPort,
): TodoUseCases {
	return {
		createTodo: createCreateTodoUseCase(todoRepository, todoEntitlementPort),
		deleteTodo: createDeleteTodoUseCase(todoRepository),
		getTodo: createGetTodoUseCase(todoRepository),
		listTodos: createListTodosUseCase(todoRepository),
		updateTodo: createUpdateTodoUseCase(todoRepository),
	};
}
