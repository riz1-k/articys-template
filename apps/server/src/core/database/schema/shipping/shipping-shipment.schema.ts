import {
	doublePrecision,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "../auth/user.schema";

export const shippingShipment = pgTable(
	"shipping_shipment",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		econtShipmentNumber: text("econt_shipment_number").notNull().unique(),
		econtRequestCourierId: text("econt_request_courier_id"),
		mode: text("mode"),
		senderName: text("sender_name"),
		senderPhone: text("sender_phone"),
		senderOfficeCode: text("sender_office_code"),
		senderCityName: text("sender_city_name"),
		receiverName: text("receiver_name"),
		receiverPhone: text("receiver_phone"),
		receiverOfficeCode: text("receiver_office_code"),
		receiverCityName: text("receiver_city_name"),
		shipmentType: text("shipment_type"),
		packCount: integer("pack_count"),
		weight: doublePrecision("weight"),
		lastKnownStatus: text("last_known_status"),
		metadata: jsonb("metadata").$type<Record<string, unknown> | null>(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("shipping_shipment_user_idx").on(table.userId),
		index("shipping_shipment_number_idx").on(table.econtShipmentNumber),
		index("shipping_shipment_status_idx").on(table.lastKnownStatus),
	],
);
