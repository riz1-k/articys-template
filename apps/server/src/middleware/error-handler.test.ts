import { describe, expect, it } from "vitest";
import { ErrorCodes } from "../lib/types/errors";
import { AppError } from "../middleware/error-handler.middleware";

describe("AppError", () => {
	it("should create an error with default code", () => {
		const error = new AppError(400, "Bad request");
		expect(error.message).toBe("Bad request");
		expect(error.statusCode).toBe(400);
		expect(error.code).toBe(ErrorCodes.INTERNAL_ERROR);
	});

	it("should create an error with custom code", () => {
		const error = new AppError(404, "Not found", ErrorCodes.NOT_FOUND);
		expect(error.code).toBe(ErrorCodes.NOT_FOUND);
	});

	it("should create an error with details", () => {
		const error = new AppError(
			422,
			"Validation failed",
			ErrorCodes.VALIDATION_ERROR,
			{
				field: "email",
			},
		);
		expect(error.details).toEqual({ field: "email" });
	});
});
