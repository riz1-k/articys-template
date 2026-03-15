import type { Context } from "hono";
import { STATUS_CODES } from "@/lib/constants";

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

function getRequestId(c: Context) {
	return c.get("requestId") ?? "unknown";
}

export function success<T>(
	c: Context,
	data: T,
	meta?: ApiResponse<T>["meta"],
): Response {
	return c.json(
		{
			success: true,
			data,
			meta,
			requestId: getRequestId(c),
		} as ApiResponse<T>,
		STATUS_CODES.OK,
	);
}

export function created<T>(c: Context, data: T): Response {
	return c.json(
		{
			success: true,
			data,
			requestId: getRequestId(c),
		} as ApiResponse<T>,
		STATUS_CODES.CREATED,
	);
}

export function paginated<T>(
	c: Context,
	data: T[],
	page: number,
	limit: number,
	total: number,
): Response {
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
			requestId: getRequestId(c),
		} as PaginatedResponse<T>,
		STATUS_CODES.OK,
	);
}

export function noContent(c: Context): Response {
	return c.body(null, STATUS_CODES.NO_CONTENT);
}
