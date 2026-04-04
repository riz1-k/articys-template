import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth/user.schema";

export const billingCustomer = pgTable("billing_customer", {
	userId: text("user_id")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	stripeCustomerId: text("stripe_customer_id").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});
