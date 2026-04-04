import { z } from "zod";

const TODO_TITLE_MAX_LENGTH = 160;
const TODO_DESCRIPTION_MAX_LENGTH = 4000;

export const todoIdParamsSchema = z.object({
	id: z.nanoid(),
});

export const createTodoBodySchema = z.object({
	title: z.string().trim().min(1).max(TODO_TITLE_MAX_LENGTH),
	description: z.string().trim().max(TODO_DESCRIPTION_MAX_LENGTH).optional(),
});

export const updateTodoBodySchema = z
	.object({
		title: z.string().trim().min(1).max(TODO_TITLE_MAX_LENGTH).optional(),
		description: z
			.string()
			.trim()
			.max(TODO_DESCRIPTION_MAX_LENGTH)
			.nullable()
			.optional(),
		completed: z.boolean().optional(),
	})
	.refine(
		(value) => Object.values(value).some((field) => field !== undefined),
		{
			message: "At least one field must be provided",
		},
	);
