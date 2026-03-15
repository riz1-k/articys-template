import type { CreateTodoInput, TodoRepository } from "../todo.repository";

export function createCreateTodoUseCase(todoRepository: TodoRepository) {
	return (input: CreateTodoInput) => todoRepository.create(input);
}
