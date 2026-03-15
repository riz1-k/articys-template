import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth/user.schema";

export const todo = pgTable(
	"todo",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		title: text("title").notNull(),
		description: text("description"),
		completed: boolean("completed").notNull().default(false),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("todo_user_id_idx").on(table.userId)],
);
