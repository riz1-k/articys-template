import type { Hono } from "hono";
import { created, noContent, success } from "@/core/http/api-response";
import { AppError } from "@/core/http/app-error";
import { ErrorCodes } from "@/core/http/error-codes";
import { getCurrentUser, requireAuth } from "@/core/http/require-auth";
import { validateBody, validateParams } from "@/core/http/validation";
import type { IdentitySessionService } from "@/features/auth";
import type { TodoService } from "@/features/todos";
import { STATUS_CODES } from "@/lib/constants";
import {
	createTodoBodySchema,
	todoIdParamsSchema,
	updateTodoBodySchema,
} from "./schemas";

function getValidatedValue<T>(
	c: { get(key: string): unknown },
	key: string,
): T {
	return c.get(key) as T;
}

export function registerTodoRoutes(
	app: Hono,
	identitySessionService: IdentitySessionService,
	todoUseCases: TodoService,
) {
	app.get("/api/todos", requireAuth(identitySessionService), async (c) => {
		const currentUser = getCurrentUser(c);
		const todos = await todoUseCases.listTodos({ userId: currentUser.id });

		return success(c, todos);
	});

	app.post(
		"/api/todos",
		requireAuth(identitySessionService),
		validateBody(createTodoBodySchema),
		async (c) => {
			const currentUser = getCurrentUser(c);
			const body = getValidatedValue<{
				title: string;
				description?: string;
			}>(c, "validatedBody");

			const todo = await todoUseCases.createTodo({
				userId: currentUser.id,
				title: body.title,
				description: body.description,
			});

			return created(c, todo);
		},
	);

	app.get(
		"/api/todos/:id",
		requireAuth(identitySessionService),
		validateParams(todoIdParamsSchema),
		async (c) => {
			const currentUser = getCurrentUser(c);
			const params = getValidatedValue<{ id: string }>(c, "validatedParams");
			const todo = await todoUseCases.getTodo({
				id: params.id,
				userId: currentUser.id,
			});

			if (!todo) {
				throw new AppError(
					STATUS_CODES.NOT_FOUND,
					"Todo not found",
					ErrorCodes.NOT_FOUND,
				);
			}

			return success(c, todo);
		},
	);

	app.patch(
		"/api/todos/:id",
		requireAuth(identitySessionService),
		validateParams(todoIdParamsSchema),
		validateBody(updateTodoBodySchema),
		async (c) => {
			const currentUser = getCurrentUser(c);
			const params = getValidatedValue<{ id: string }>(c, "validatedParams");
			const body = getValidatedValue<{
				title?: string;
				description?: string | null;
				completed?: boolean;
			}>(c, "validatedBody");

			const todo = await todoUseCases.updateTodo({
				id: params.id,
				userId: currentUser.id,
				title: body.title,
				description: body.description,
				completed: body.completed,
			});

			if (!todo) {
				throw new AppError(
					STATUS_CODES.NOT_FOUND,
					"Todo not found",
					ErrorCodes.NOT_FOUND,
				);
			}

			return success(c, todo);
		},
	);

	app.delete(
		"/api/todos/:id",
		requireAuth(identitySessionService),
		validateParams(todoIdParamsSchema),
		async (c) => {
			const currentUser = getCurrentUser(c);
			const params = getValidatedValue<{ id: string }>(c, "validatedParams");
			const deleted = await todoUseCases.deleteTodo({
				id: params.id,
				userId: currentUser.id,
			});

			if (!deleted) {
				throw new AppError(
					STATUS_CODES.NOT_FOUND,
					"Todo not found",
					ErrorCodes.NOT_FOUND,
				);
			}

			return noContent(c);
		},
	);
}
