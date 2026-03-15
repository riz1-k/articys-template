import type { TodoRepository, UpdateTodoInput } from "../todo.repository";

export function createUpdateTodoUseCase(todoRepository: TodoRepository) {
	return (input: UpdateTodoInput) => todoRepository.update(input);
}
