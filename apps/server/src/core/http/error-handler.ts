import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { logger } from "@/core/observability/logger";
import { STATUS_CODES } from "@/lib/constants";
import { AppError } from "./app-error";
import { ErrorCodes } from "./error-codes";

export function errorHandler(err: Error, c: Context) {
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
			err.statusCode as ContentfulStatusCode,
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
		STATUS_CODES.INTERNAL_SERVER_ERROR,
	);
}
