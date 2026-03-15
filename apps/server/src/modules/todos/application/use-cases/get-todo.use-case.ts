import type { TodoRepository } from "../todo.repository";

interface GetTodoInput {
	id: string;
	userId: string;
}

export function createGetTodoUseCase(todoRepository: TodoRepository) {
	return ({ id, userId }: GetTodoInput) => todoRepository.findById(id, userId);
}
