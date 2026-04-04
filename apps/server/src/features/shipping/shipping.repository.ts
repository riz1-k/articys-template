export interface StoredShipmentSummary {
	id: string;
	userId: string;
	econtShipmentNumber: string;
	econtRequestCourierId: string | null;
	mode: string | null;
	senderName: string | null;
	senderPhone: string | null;
	senderOfficeCode: string | null;
	senderCityName: string | null;
	receiverName: string | null;
	receiverPhone: string | null;
	receiverOfficeCode: string | null;
	receiverCityName: string | null;
	shipmentType: string | null;
	packCount: number | null;
	weight: number | null;
	lastKnownStatus: string | null;
	metadata: Record<string, unknown> | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateStoredShipmentInput {
	userId: string;
	econtShipmentNumber: string;
	econtRequestCourierId?: string | null;
	mode?: string | null;
	senderName?: string | null;
	senderPhone?: string | null;
	senderOfficeCode?: string | null;
	senderCityName?: string | null;
	receiverName?: string | null;
	receiverPhone?: string | null;
	receiverOfficeCode?: string | null;
	receiverCityName?: string | null;
	shipmentType?: string | null;
	packCount?: number | null;
	weight?: number | null;
	lastKnownStatus?: string | null;
	metadata?: Record<string, unknown> | null;
}

export interface UpdateStoredShipmentInput {
	econtRequestCourierId?: string | null;
	mode?: string | null;
	senderName?: string | null;
	senderPhone?: string | null;
	senderOfficeCode?: string | null;
	senderCityName?: string | null;
	receiverName?: string | null;
	receiverPhone?: string | null;
	receiverOfficeCode?: string | null;
	receiverCityName?: string | null;
	shipmentType?: string | null;
	packCount?: number | null;
	weight?: number | null;
	lastKnownStatus?: string | null;
	metadata?: Record<string, unknown> | null;
}

export interface ShippingRepository {
	create(input: CreateStoredShipmentInput): Promise<StoredShipmentSummary>;
	findByIdForUser(
		id: string,
		userId: string,
	): Promise<StoredShipmentSummary | null>;
	listByUserId(userId: string): Promise<StoredShipmentSummary[]>;
	findByShipmentNumber(
		shipmentNumber: string,
	): Promise<StoredShipmentSummary | null>;
	updateByShipmentNumber(
		shipmentNumber: string,
		input: UpdateStoredShipmentInput,
	): Promise<StoredShipmentSummary | null>;
}
