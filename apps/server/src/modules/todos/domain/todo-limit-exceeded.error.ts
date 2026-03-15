export class TodoLimitExceededError extends Error {
	constructor(public readonly maxTodos: number) {
		super(`Free plan users can only create up to ${maxTodos} todos`);
		this.name = "TodoLimitExceededError";
	}
}
