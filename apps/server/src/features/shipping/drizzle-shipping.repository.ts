import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/core/database";
import { shippingShipment } from "@/core/database/schema/shipping";
import type {
	ShippingRepository,
	StoredShipmentSummary,
	UpdateStoredShipmentInput,
} from "@/features/shipping/shipping.repository";

export function createDrizzleShippingRepository(): ShippingRepository {
	return {
		async create(input) {
			const [record] = await db
				.insert(shippingShipment)
				.values({
					id: nanoid(),
					...input,
				})
				.returning();

			if (!record) {
				throw new Error("Failed to persist shipping shipment");
			}

			return mapRecord(record);
		},
		async findByIdForUser(id, userId) {
			const [record] = await db
				.select()
				.from(shippingShipment)
				.where(
					and(eq(shippingShipment.id, id), eq(shippingShipment.userId, userId)),
				)
				.limit(1);

			return record ? mapRecord(record) : null;
		},
		async listByUserId(userId) {
			const records = await db
				.select()
				.from(shippingShipment)
				.where(eq(shippingShipment.userId, userId))
				.orderBy(desc(shippingShipment.createdAt));

			return records.map(mapRecord);
		},
		async findByShipmentNumber(shipmentNumber) {
			const [record] = await db
				.select()
				.from(shippingShipment)
				.where(eq(shippingShipment.econtShipmentNumber, shipmentNumber))
				.limit(1);

			return record ? mapRecord(record) : null;
		},
		async updateByShipmentNumber(shipmentNumber, input) {
			const updateValues = cleanUndefined({
				...input,
				updatedAt: new Date(),
			});

			const [record] = await db
				.update(shippingShipment)
				.set(updateValues)
				.where(eq(shippingShipment.econtShipmentNumber, shipmentNumber))
				.returning();

			return record ? mapRecord(record) : null;
		},
	};
}

function mapRecord(
	record: typeof shippingShipment.$inferSelect,
): StoredShipmentSummary {
	return {
		id: record.id,
		userId: record.userId,
		econtShipmentNumber: record.econtShipmentNumber,
		econtRequestCourierId: record.econtRequestCourierId,
		mode: record.mode,
		senderName: record.senderName,
		senderPhone: record.senderPhone,
		senderOfficeCode: record.senderOfficeCode,
		senderCityName: record.senderCityName,
		receiverName: record.receiverName,
		receiverPhone: record.receiverPhone,
		receiverOfficeCode: record.receiverOfficeCode,
		receiverCityName: record.receiverCityName,
		shipmentType: record.shipmentType,
		packCount: record.packCount,
		weight: record.weight,
		lastKnownStatus: record.lastKnownStatus,
		metadata: record.metadata ?? null,
		createdAt: record.createdAt,
		updatedAt: record.updatedAt,
	};
}

function cleanUndefined(
	input: UpdateStoredShipmentInput & { updatedAt: Date },
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(input).filter(([, value]) => value !== undefined),
	);
}
