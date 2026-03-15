import type { TodoRepository } from "../todo.repository";

interface ListTodosInput {
	userId: string;
}

export function createListTodosUseCase(todoRepository: TodoRepository) {
	return ({ userId }: ListTodosInput) => todoRepository.listByUserId(userId);
}
