import type { MiddlewareHandler } from "hono";
import type { z } from "zod";
import { AppError } from "./error-handler.middleware";

export function validateBody<T extends z.ZodType>(
	schema: T,
): MiddlewareHandler {
	return async (c, next) => {
		const body = await c.req.json();

		const result = await schema.safeParseAsync(body);

		if (!result.success) {
			const errors = result.error.issues.map((issue) => ({
				path: issue.path.join("."),
				message: issue.message,
			}));

			throw new AppError(400, "Validation failed", "VALIDATION_ERROR", errors);
		}

		c.set("validatedBody", result.data);
		await next();
	};
}

export function validateQuery<T extends z.ZodType>(
	schema: T,
): MiddlewareHandler {
	return async (c, next) => {
		const query = c.req.query();

		const result = await schema.safeParseAsync(query);

		if (!result.success) {
			const errors = result.error.issues.map((issue) => ({
				path: issue.path.join("."),
				message: issue.message,
			}));

			throw new AppError(400, "Validation failed", "VALIDATION_ERROR", errors);
		}

		c.set("validatedQuery", result.data);
		await next();
	};
}

export function validateParams<T extends z.ZodType>(
	schema: T,
): MiddlewareHandler {
	return async (c, next) => {
		const params = c.req.param();

		const result = await schema.safeParseAsync(params);

		if (!result.success) {
			const errors = result.error.issues.map((issue) => ({
				path: issue.path.join("."),
				message: issue.message,
			}));

			throw new AppError(400, "Validation failed", "VALIDATION_ERROR", errors);
		}

		c.set("validatedParams", result.data);
		await next();
	};
}
