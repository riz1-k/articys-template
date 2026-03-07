import { z } from "zod";

export const paginationSchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(10),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

export const idParamSchema = z.object({
	id: z.string().min(1),
});

export type IdParam = z.infer<typeof idParamSchema>;

export const cursorSchema = z.object({
	cursor: z.string().optional(),
	limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CursorParams = z.infer<typeof cursorSchema>;
