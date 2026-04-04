CREATE TABLE "shipping_shipment" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"econt_shipment_number" text NOT NULL,
	"econt_request_courier_id" text,
	"mode" text,
	"sender_name" text,
	"sender_phone" text,
	"sender_office_code" text,
	"sender_city_name" text,
	"receiver_name" text,
	"receiver_phone" text,
	"receiver_office_code" text,
	"receiver_city_name" text,
	"shipment_type" text,
	"pack_count" integer,
	"weight" double precision,
	"last_known_status" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shipping_shipment_econt_shipment_number_unique" UNIQUE("econt_shipment_number")
);
--> statement-breakpoint
ALTER TABLE "shipping_shipment" ADD CONSTRAINT "shipping_shipment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "shipping_shipment_user_idx" ON "shipping_shipment" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "shipping_shipment_number_idx" ON "shipping_shipment" USING btree ("econt_shipment_number");--> statement-breakpoint
CREATE INDEX "shipping_shipment_status_idx" ON "shipping_shipment" USING btree ("last_known_status");