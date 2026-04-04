import { type ErrorCode, ErrorCodes } from "./error-codes";

export class AppError extends Error {
	constructor(
		public statusCode: number,
		message: string,
		public code: ErrorCode = ErrorCodes.INTERNAL_ERROR,
		public details?: unknown,
	) {
		super(message);
		this.name = "AppError";
	}
}
