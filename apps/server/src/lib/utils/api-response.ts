import type { Context } from "hono";

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: {
		code: string;
		message: string;
		details?: unknown;
	};
	meta?: {
		page?: number;
		limit?: number;
		total?: number;
	};
	requestId?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export function success<T>(
	c: Context,
	data: T,
	meta?: ApiResponse<T>["meta"],
): Response {
	const requestId = c.get("requestId") ?? "unknown";

	return c.json(
		{
			success: true,
			data,
			meta,
			requestId,
		} as ApiResponse<T>,
		200,
	);
}

export function created<T>(c: Context, data: T): Response {
	const requestId = c.get("requestId") ?? "unknown";

	return c.json(
		{
			success: true,
			data,
			requestId,
		} as ApiResponse<T>,
		201,
	);
}

export function paginated<T>(
	c: Context,
	data: T[],
	page: number,
	limit: number,
	total: number,
): Response {
	const requestId = c.get("requestId") ?? "unknown";
	const totalPages = Math.ceil(total / limit);

	return c.json(
		{
			success: true,
			data,
			meta: {
				page,
				limit,
				total,
				totalPages,
			},
			requestId,
		} as PaginatedResponse<T>,
		200,
	);
}

export function noContent(c: Context): Response {
	return c.body(null, 204);
}
