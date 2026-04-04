import type { Hono } from "hono";
import type { IdentitySessionService } from "@/features/auth";
import type { TodoEntitlementPort } from "@/features/billing/todo-entitlement.port";
import { createDrizzleTodoRepository } from "./drizzle-todo-repository";
import { registerTodoRoutes } from "./routes";
import { createTodoService, type TodoService } from "./service";
import type { TodoRepository } from "./todo.repository";

export { createDrizzleTodoRepository } from "./drizzle-todo-repository";
export type { TodoService, TodoUseCases } from "./service";

export interface TodosFeature {
	register(app: Hono): void;
	repository: TodoRepository;
	service: TodoService;
}

export function createTodosFeature(input: {
	identitySessionService: IdentitySessionService;
	todoEntitlementPort: TodoEntitlementPort;
	todoRepository?: TodoRepository;
}): TodosFeature {
	const repository = input.todoRepository ?? createDrizzleTodoRepository();
	const service = createTodoService(repository, input.todoEntitlementPort);

	return {
		repository,
		service,
		register(app) {
			registerTodoRoutes(app, input.identitySessionService, service);
		},
	};
}
