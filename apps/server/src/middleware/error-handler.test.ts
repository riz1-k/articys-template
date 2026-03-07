import { describe, expect, it } from "vitest";

import { STATUS_CODES } from "@/lib/constants";
import { ErrorCodes } from "../lib/types/errors";
import { AppError } from "../middleware/error-handler.middleware";

describe("AppError", () => {
	it("should create an error with default code", () => {
		const error = new AppError(STATUS_CODES.BAD_REQUEST, "Bad request");
		expect(error.message).toBe("Bad request");
		expect(error.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
		expect(error.code).toBe(ErrorCodes.INTERNAL_ERROR);
	});

	it("should create an error with custom code", () => {
		const error = new AppError(
			STATUS_CODES.NOT_FOUND,
			"Not found",
			ErrorCodes.NOT_FOUND,
		);
		expect(error.code).toBe(ErrorCodes.NOT_FOUND);
	});

	it("should create an error with details", () => {
		const error = new AppError(
			STATUS_CODES.UNPROCESSABLE_ENTITY,
			"Validation failed",
			ErrorCodes.VALIDATION_ERROR,
			{
				field: "email",
			},
		);
		expect(error.details).toEqual({ field: "email" });
	});
});
