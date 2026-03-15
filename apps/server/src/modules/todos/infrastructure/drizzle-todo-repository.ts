import { randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/infrastructure/database";
import { todo } from "@/infrastructure/database/schema/todo";
import type {
	CreateTodoInput,
	TodoRepository,
	UpdateTodoInput,
} from "@/modules/todos/application/todo.repository";

export function createDrizzleTodoRepository(): TodoRepository {
	return {
		async findById(id, userId) {
			const [todoRecord] = await db
				.select()
				.from(todo)
				.where(and(eq(todo.id, id), eq(todo.userId, userId)))
				.limit(1);

			return todoRecord ?? null;
		},

		async listByUserId(userId) {
			return db
				.select()
				.from(todo)
				.where(eq(todo.userId, userId))
				.orderBy(desc(todo.createdAt));
		},

		async create(input: CreateTodoInput) {
			const [todoRecord] = await db
				.insert(todo)
				.values({
					id: randomUUID(),
					userId: input.userId,
					title: input.title,
					description: input.description ?? null,
				})
				.returning();

			if (!todoRecord) {
				throw new Error("Failed to create todo record");
			}

			return todoRecord;
		},

		async update(input: UpdateTodoInput) {
			const [todoRecord] = await db
				.update(todo)
				.set({
					title: input.title,
					description: input.description,
					completed: input.completed,
					updatedAt: new Date(),
				})
				.where(and(eq(todo.id, input.id), eq(todo.userId, input.userId)))
				.returning();

			return todoRecord ?? null;
		},

		async delete(id, userId) {
			const deleted = await db
				.delete(todo)
				.where(and(eq(todo.id, id), eq(todo.userId, userId)))
				.returning({ id: todo.id });

			return deleted.length > 0;
		},
	};
}
