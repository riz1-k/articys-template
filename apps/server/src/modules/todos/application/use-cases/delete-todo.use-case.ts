import type { TodoRepository } from "../todo.repository";

interface DeleteTodoInput {
	id: string;
	userId: string;
}

export function createDeleteTodoUseCase(todoRepository: TodoRepository) {
	return ({ id, userId }: DeleteTodoInput) => todoRepository.delete(id, userId);
}
