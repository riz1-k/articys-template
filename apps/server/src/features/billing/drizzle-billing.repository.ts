import { eq } from "drizzle-orm";
import { db } from "@/core/database";
import {
	billingCustomer,
	billingSubscription,
} from "@/core/database/schema/billing";
import type {
	BillingRepository,
	SaveBillingCustomerInput,
	UpsertBillingSubscriptionInput,
} from "@/features/billing/billing.repository";
import type { BillingSubscription } from "@/features/billing/subscription";

export function createDrizzleBillingRepository(): BillingRepository {
	return {
		async findCustomerByUserId(userId) {
			const [record] = await db
				.select()
				.from(billingCustomer)
				.where(eq(billingCustomer.userId, userId))
				.limit(1);

			return record ?? null;
		},

		async findCustomerByStripeCustomerId(stripeCustomerId) {
			const [record] = await db
				.select()
				.from(billingCustomer)
				.where(eq(billingCustomer.stripeCustomerId, stripeCustomerId))
				.limit(1);

			return record ?? null;
		},

		async saveCustomer(input: SaveBillingCustomerInput) {
			const [record] = await db
				.insert(billingCustomer)
				.values(input)
				.onConflictDoUpdate({
					target: billingCustomer.userId,
					set: {
						stripeCustomerId: input.stripeCustomerId,
						updatedAt: new Date(),
					},
				})
				.returning();

			if (!record) {
				throw new Error("Failed to persist billing customer");
			}

			return record;
		},

		async findSubscriptionByUserId(userId) {
			const [record] = await db
				.select()
				.from(billingSubscription)
				.where(eq(billingSubscription.userId, userId))
				.limit(1);

			return record ? mapSubscriptionRecord(record) : null;
		},

		async upsertSubscription(input: UpsertBillingSubscriptionInput) {
			const [record] = await db
				.insert(billingSubscription)
				.values(input)
				.onConflictDoUpdate({
					target: billingSubscription.userId,
					set: {
						stripeCustomerId: input.stripeCustomerId,
						stripeSubscriptionId: input.stripeSubscriptionId,
						plan: input.plan,
						stripePriceId: input.stripePriceId,
						status: input.status,
						cancelAtPeriodEnd: input.cancelAtPeriodEnd,
						currentPeriodEnd: input.currentPeriodEnd,
						updatedAt: new Date(),
					},
				})
				.returning();

			if (!record) {
				throw new Error("Failed to persist billing subscription");
			}

			return mapSubscriptionRecord(record);
		},
	};
}

function mapSubscriptionRecord(
	record: typeof billingSubscription.$inferSelect,
): BillingSubscription {
	return {
		userId: record.userId,
		stripeCustomerId: record.stripeCustomerId,
		stripeSubscriptionId: record.stripeSubscriptionId,
		plan: record.plan as BillingSubscription["plan"],
		stripePriceId: record.stripePriceId,
		status: record.status as BillingSubscription["status"],
		cancelAtPeriodEnd: record.cancelAtPeriodEnd,
		currentPeriodEnd: record.currentPeriodEnd,
	};
}
