import { describe, expect, it } from "vitest";
import type { AppError } from "@/core/http/app-error";
import { ErrorCodes } from "@/core/http/error-codes";
import { FREE_TODO_LIMIT } from "@/features/billing/todo-entitlement";
import type { Todo } from "@/features/todos/todo";
import { createTodoUseCases } from "./service";
import type {
	CreateTodoInput,
	TodoRepository,
	UpdateTodoInput,
} from "./todo.repository";

function createInMemoryTodoRepository(seed: Todo[] = []): TodoRepository {
	const todos = [...seed];

	return {
		async findById(id, userId) {
			return (
				todos.find((todo) => todo.id === id && todo.userId === userId) ?? null
			);
		},
		async listByUserId(userId) {
			return todos.filter((todo) => todo.userId === userId);
		},
		async countByUserId(userId) {
			return todos.filter((todo) => todo.userId === userId).length;
		},
		async create(input: CreateTodoInput) {
			const todo: Todo = {
				id: `todo-${todos.length + 1}`,
				userId: input.userId,
				title: input.title,
				description: input.description ?? null,
				completed: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			todos.push(todo);
			return todo;
		},
		async update(input: UpdateTodoInput) {
			const index = todos.findIndex(
				(todo) => todo.id === input.id && todo.userId === input.userId,
			);

			if (index === -1) {
				return null;
			}

			const existingTodo = todos[index];

			if (!existingTodo) {
				return null;
			}

			const updatedTodo: Todo = {
				...existingTodo,
				title: input.title ?? existingTodo.title,
				description:
					input.description !== undefined
						? input.description
						: existingTodo.description,
				completed: input.completed ?? existingTodo.completed,
				updatedAt: new Date(),
			};

			todos[index] = updatedTodo;
			return updatedTodo;
		},
		async delete(id, userId) {
			const index = todos.findIndex(
				(todo) => todo.id === id && todo.userId === userId,
			);

			if (index === -1) {
				return false;
			}

			todos.splice(index, 1);
			return true;
		},
	};
}

describe("createTodoUseCases", () => {
	it("creates and lists todos for the current user", async () => {
		const useCases = createTodoUseCases(createInMemoryTodoRepository(), {
			getTodoEntitlement: async ({ currentTodoCount }) => ({
				hasActiveSubscription: false,
				maxTodos: FREE_TODO_LIMIT,
				currentTodoCount,
				canCreateMoreTodos: true,
			}),
		});

		await useCases.createTodo({
			userId: "user-1",
			title: "Ship DDD migration",
			description: "Move toward modules and use cases",
		});

		const todos = await useCases.listTodos({ userId: "user-1" });

		expect(todos).toHaveLength(1);
		expect(todos[0]?.title).toBe("Ship DDD migration");
	});

	it("only updates todos owned by the current user", async () => {
		const useCases = createTodoUseCases(
			createInMemoryTodoRepository([
				{
					id: "todo-1",
					userId: "user-1",
					title: "Original",
					description: null,
					completed: false,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]),
			{
				getTodoEntitlement: async ({ currentTodoCount }) => ({
					hasActiveSubscription: false,
					maxTodos: FREE_TODO_LIMIT,
					currentTodoCount,
					canCreateMoreTodos: true,
				}),
			},
		);

		const updated = await useCases.updateTodo({
			id: "todo-1",
			userId: "user-1",
			completed: true,
		});

		const blocked = await useCases.updateTodo({
			id: "todo-1",
			userId: "user-2",
			completed: true,
		});

		expect(updated?.completed).toBe(true);
		expect(blocked).toBeNull();
	});

	it("deletes only owned todos", async () => {
		const useCases = createTodoUseCases(
			createInMemoryTodoRepository([
				{
					id: "todo-1",
					userId: "user-1",
					title: "Delete me",
					description: null,
					completed: false,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]),
			{
				getTodoEntitlement: async ({ currentTodoCount }) => ({
					hasActiveSubscription: false,
					maxTodos: FREE_TODO_LIMIT,
					currentTodoCount,
					canCreateMoreTodos: true,
				}),
			},
		);

		await expect(
			useCases.deleteTodo({ id: "todo-1", userId: "user-2" }),
		).resolves.toBe(false);
		await expect(
			useCases.deleteTodo({ id: "todo-1", userId: "user-1" }),
		).resolves.toBe(true);
	});

	it("blocks free users from creating more than five todos", async () => {
		const useCases = createTodoUseCases(
			createInMemoryTodoRepository(
				Array.from({ length: FREE_TODO_LIMIT }, (_, index) => ({
					id: `todo-${index + 1}`,
					userId: "user-1",
					title: `Todo ${index + 1}`,
					description: null,
					completed: false,
					createdAt: new Date(),
					updatedAt: new Date(),
				})),
			),
			{
				getTodoEntitlement: async ({ currentTodoCount }) => ({
					hasActiveSubscription: false,
					maxTodos: FREE_TODO_LIMIT,
					currentTodoCount,
					canCreateMoreTodos: currentTodoCount < FREE_TODO_LIMIT,
				}),
			},
		);

		await expect(
			useCases.createTodo({
				userId: "user-1",
				title: "Todo 6",
			}),
		).rejects.toMatchObject({
			code: ErrorCodes.SUBSCRIPTION_REQUIRED,
			statusCode: 403,
		} satisfies Partial<AppError>);
	});
});
