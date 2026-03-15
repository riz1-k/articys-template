import type { MiddlewareHandler } from "hono";
import type { z } from "zod";
import { STATUS_CODES } from "@/lib/constants";
import { AppError } from "./app-error";

function mapIssues(issues: z.ZodIssue[]) {
	return issues.map((issue) => ({
		path: issue.path.join("."),
		message: issue.message,
	}));
}

export function validateBody<T extends z.ZodType>(
	schema: T,
): MiddlewareHandler {
	return async (c, next) => {
		const body = await c.req.json();
		const result = await schema.safeParseAsync(body);

		if (!result.success) {
			throw new AppError(
				STATUS_CODES.BAD_REQUEST,
				"Validation failed",
				"VALIDATION_ERROR",
				mapIssues(result.error.issues),
			);
		}

		c.set("validatedBody", result.data);
		await next();
	};
}

export function validateQuery<T extends z.ZodType>(
	schema: T,
): MiddlewareHandler {
	return async (c, next) => {
		const result = await schema.safeParseAsync(c.req.query());

		if (!result.success) {
			throw new AppError(
				STATUS_CODES.BAD_REQUEST,
				"Validation failed",
				"VALIDATION_ERROR",
				mapIssues(result.error.issues),
			);
		}

		c.set("validatedQuery", result.data);
		await next();
	};
}

export function validateParams<T extends z.ZodType>(
	schema: T,
): MiddlewareHandler {
	return async (c, next) => {
		const result = await schema.safeParseAsync(c.req.param());

		if (!result.success) {
			throw new AppError(
				STATUS_CODES.BAD_REQUEST,
				"Validation failed",
				"VALIDATION_ERROR",
				mapIssues(result.error.issues),
			);
		}

		c.set("validatedParams", result.data);
		await next();
	};
}
