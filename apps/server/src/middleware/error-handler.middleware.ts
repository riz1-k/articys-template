import type { Context, Next } from "hono";
import { ErrorCodes } from "../lib/types/errors";
import { logger } from "../lib/utils/logger";

export class AppError extends Error {
	constructor(
		public statusCode: number,
		message: string,
		public code: (typeof ErrorCodes)[keyof typeof ErrorCodes] = ErrorCodes.INTERNAL_ERROR,
		public details?: unknown,
	) {
		super(message);
		this.name = "AppError";
	}
}

export async function errorHandler(c: Context, next: Next) {
	try {
		await next();
	} catch (err) {
		const requestId = c.get("requestId") ?? "unknown";

		if (err instanceof AppError) {
			logger.warn(
				{
					requestId,
					code: err.code,
					statusCode: err.statusCode,
					details: err.details,
				},
				err.message,
			);

			return c.json(
				{
					success: false,
					error: {
						code: err.code,
						message: err.message,
						details: err.details,
					},
					requestId,
				},
				err.statusCode as 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500 | 503,
			);
		}

		logger.error({ requestId, err }, "unhandled error");

		return c.json(
			{
				success: false,
				error: {
					code: ErrorCodes.INTERNAL_ERROR,
					message: "An unexpected error occurred",
				},
				requestId,
			},
			500,
		);
	}
}
