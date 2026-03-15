import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth/user.schema";

export const billingSubscription = pgTable(
	"billing_subscription",
	{
		userId: text("user_id")
			.primaryKey()
			.references(() => user.id, { onDelete: "cascade" }),
		stripeCustomerId: text("stripe_customer_id").notNull(),
		stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
		plan: text("plan"),
		stripePriceId: text("stripe_price_id"),
		status: text("status").notNull(),
		cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
		currentPeriodEnd: timestamp("current_period_end"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("billing_subscription_customer_idx").on(table.stripeCustomerId),
		index("billing_subscription_status_idx").on(table.status),
	],
);
