import type {
	AddressServiceTimesRequest,
	CreateCDAgreementRequest,
	GetMyAWBRequest,
	GetNearestOfficesRequest,
	GetOfficesRequest,
	GetStreetsRequest,
	PaymentReportRequest,
	RequestCourierRequest,
	ShippingLabel,
	ThreeWayLogisticsRequest,
	UpdateLabelRequestData,
	UpdateLabelsRequest,
	ValidateAddressRequest,
} from "@alphabite/econt-sdk";
import type {
	CreateStoredShipmentInput,
	ShippingRepository,
	StoredShipmentSummary,
	UpdateStoredShipmentInput,
} from "./shipping.repository";
import type { ShippingGatewayPort } from "./shipping-gateway.port";

export interface ShippingService {
	getOffices(
		input: GetOfficesRequest,
	): Promise<Awaited<ReturnType<ShippingGatewayPort["getOffices"]>>>;
	getOfficeByCode(
		officeCode: string,
	): Promise<Awaited<ReturnType<ShippingGatewayPort["getOfficeByCode"]>>>;
	getCities(input: {
		countryCode: string;
		cityId?: string | number;
	}): Promise<Awaited<ReturnType<ShippingGatewayPort["getCities"]>>>;
	getCountries(): Promise<
		Awaited<ReturnType<ShippingGatewayPort["getCountries"]>>
	>;
	getStreets(
		input: GetStreetsRequest,
	): Promise<Awaited<ReturnType<ShippingGatewayPort["getStreets"]>>>;
	getQuarters(input: {
		cityID?: string | number;
	}): Promise<Awaited<ReturnType<ShippingGatewayPort["getQuarters"]>>>;
	validateAddress(
		input: ValidateAddressRequest,
	): Promise<Awaited<ReturnType<ShippingGatewayPort["validateAddress"]>>>;
	getAddressServiceTimes(
		input: AddressServiceTimesRequest,
	): Promise<
		Awaited<ReturnType<ShippingGatewayPort["getAddressServiceTimes"]>>
	>;
	getNearestOffices(
		input: GetNearestOfficesRequest,
	): Promise<Awaited<ReturnType<ShippingGatewayPort["getNearestOffices"]>>>;
	calculateShipment(
		input: ShippingLabel,
	): Promise<Awaited<ReturnType<ShippingGatewayPort["calculateShipment"]>>>;
	validateShipment(
		input: ShippingLabel,
	): Promise<Awaited<ReturnType<ShippingGatewayPort["validateShipment"]>>>;
	createShipment(input: {
		userId: string;
		label: ShippingLabel;
		options?: {
			requestCourierTimeFrom?: string;
			requestCourierTimeTo?: string;
			mode?: "calculate" | "validate" | "create" | "calculate_with_block";
		};
	}): Promise<{
		upstream: Awaited<ReturnType<ShippingGatewayPort["createShipment"]>>;
		storedShipment: StoredShipmentSummary | null;
	}>;
	createShipments(input: {
		userId: string;
		labels: ShippingLabel[];
		options?: {
			runAsyncAndEmailResultTo?: string;
			mode?: "validate" | "calculate" | "create";
		};
	}): Promise<{
		upstream: Awaited<ReturnType<ShippingGatewayPort["createShipments"]>>;
		storedShipments: StoredShipmentSummary[];
	}>;
	deleteShipments(input: {
		shipmentNumbers: string[];
	}): Promise<Awaited<ReturnType<ShippingGatewayPort["deleteShipments"]>>>;
	updateShipment(input: { payload: UpdateLabelRequestData }): Promise<{
		upstream: Awaited<ReturnType<ShippingGatewayPort["updateShipment"]>>;
		storedShipment: StoredShipmentSummary | null;
	}>;
	updateShipments(input: { payload: UpdateLabelsRequest }): Promise<{
		upstream: Awaited<ReturnType<ShippingGatewayPort["updateShipments"]>>;
		storedShipments: StoredShipmentSummary[];
	}>;
	checkShipmentEditability(input: {
		shipmentNumbers: number[];
	}): Promise<
		Awaited<ReturnType<ShippingGatewayPort["checkShipmentEditability"]>>
	>;
	groupShipments(input: {
		shipmentNumbers: number[];
	}): Promise<Awaited<ReturnType<ShippingGatewayPort["groupShipments"]>>>;
	cancelShipmentGroup(input: {
		groupLabel: number;
	}): Promise<Awaited<ReturnType<ShippingGatewayPort["cancelShipmentGroup"]>>>;
	requestCourier(input: { payload: RequestCourierRequest }): Promise<{
		upstream: Awaited<ReturnType<ShippingGatewayPort["requestCourier"]>>;
		storedShipments: StoredShipmentSummary[];
	}>;
	getShipmentStatuses(input: {
		shipmentNumbers: string[];
	}): Promise<Awaited<ReturnType<ShippingGatewayPort["getShipmentStatuses"]>>>;
	getCourierRequestStatuses(input: {
		requestCourierIds: string[];
	}): Promise<
		Awaited<ReturnType<ShippingGatewayPort["getCourierRequestStatuses"]>>
	>;
	getMyAwb(
		input: GetMyAWBRequest,
	): Promise<Awaited<ReturnType<ShippingGatewayPort["getMyAwb"]>>>;
	setItuCode(input: {
		awbBarcode: string;
		truckRegNum: string;
		ituCode: string;
	}): Promise<Awaited<ReturnType<ShippingGatewayPort["setItuCode"]>>>;
	trackShipment(input: {
		shipmentNumber: string;
	}): Promise<Awaited<ReturnType<ShippingGatewayPort["trackShipment"]>>>;
	getClientProfiles(): Promise<
		Awaited<ReturnType<ShippingGatewayPort["getClientProfiles"]>>
	>;
	createCdAgreement(
		input: CreateCDAgreementRequest,
	): Promise<Awaited<ReturnType<ShippingGatewayPort["createCdAgreement"]>>>;
	runThreeWayLogistics(
		input: ThreeWayLogisticsRequest,
	): Promise<Awaited<ReturnType<ShippingGatewayPort["runThreeWayLogistics"]>>>;
	getPaymentReport(
		input: PaymentReportRequest,
	): Promise<Awaited<ReturnType<ShippingGatewayPort["getPaymentReport"]>>>;
	listLocalShipments(input: {
		userId: string;
	}): Promise<StoredShipmentSummary[]>;
	getLocalShipment(input: {
		userId: string;
		id: string;
	}): Promise<StoredShipmentSummary | null>;
}

export type ShippingUseCases = ShippingService;

export function createShippingService(input: {
	shippingGateway: ShippingGatewayPort;
	shippingRepository: ShippingRepository;
}): ShippingService {
	const { shippingGateway, shippingRepository } = input;

	return {
		getOffices: (payload) => shippingGateway.getOffices(payload),
		getOfficeByCode: (officeCode) =>
			shippingGateway.getOfficeByCode(officeCode),
		getCities: (payload) => shippingGateway.getCities(payload),
		getCountries: () => shippingGateway.getCountries(),
		getStreets: (payload) => shippingGateway.getStreets(payload),
		getQuarters: (payload) => shippingGateway.getQuarters(payload),
		validateAddress: (payload) => shippingGateway.validateAddress(payload),
		getAddressServiceTimes: (payload) =>
			shippingGateway.getAddressServiceTimes(payload),
		getNearestOffices: (payload) => shippingGateway.getNearestOffices(payload),
		calculateShipment: (label) => shippingGateway.calculateShipment(label),
		validateShipment: (label) => shippingGateway.validateShipment(label),
		async createShipment({ userId, label, options }) {
			const upstream = await shippingGateway.createShipment(label, options);
			const shipmentNumber = upstream.label?.shipmentNumber;

			if (!shipmentNumber) {
				return { upstream, storedShipment: null };
			}

			const storedShipment = await shippingRepository.create(
				buildStoredShipmentCreateInput({
					userId,
					label,
					shipmentNumber,
					requestCourierId: upstream.courierRequestID?.toString() ?? null,
					mode: options?.mode ?? "create",
					lastKnownStatus: upstream.label?.shortDeliveryStatus ?? null,
				}),
			);

			return { upstream, storedShipment };
		},
		async createShipments({ userId, labels, options }) {
			const upstream = await shippingGateway.createShipments(labels, options);
			const storedShipments: StoredShipmentSummary[] = [];

			for (const [index, result] of (upstream.results ?? []).entries()) {
				const shipmentNumber = result.label?.shipmentNumber;
				const label = labels[index];

				if (!shipmentNumber || !label) {
					continue;
				}

				storedShipments.push(
					await shippingRepository.create(
						buildStoredShipmentCreateInput({
							userId,
							label,
							shipmentNumber,
							mode: options?.mode ?? "create",
							lastKnownStatus: result.label?.shortDeliveryStatus ?? null,
						}),
					),
				);
			}

			return { upstream, storedShipments };
		},
		async deleteShipments({ shipmentNumbers }) {
			const upstream = await shippingGateway.deleteShipments(shipmentNumbers);

			for (const result of upstream.results ?? []) {
				if (!result.shipmentNum) {
					continue;
				}

				await shippingRepository.updateByShipmentNumber(result.shipmentNum, {
					lastKnownStatus: "deleted",
				});
			}

			return upstream;
		},
		async updateShipment({ payload }) {
			const upstream = await shippingGateway.updateShipment(payload);
			const shipmentNumber =
				upstream.label?.shipmentNumber ?? payload.label.shipmentNumber;

			if (!shipmentNumber) {
				return { upstream, storedShipment: null };
			}

			const storedShipment = await shippingRepository.updateByShipmentNumber(
				shipmentNumber,
				buildStoredShipmentUpdateInput({
					label: payload.label,
					lastKnownStatus: upstream.label?.shortDeliveryStatus ?? null,
				}),
			);

			return { upstream, storedShipment };
		},
		async updateShipments({ payload }) {
			const upstream = await shippingGateway.updateShipments(payload);
			const storedShipments: StoredShipmentSummary[] = [];

			for (const [index, result] of (upstream.results ?? []).entries()) {
				const label = payload.labels[index]?.label;
				const shipmentNumber =
					result.labels?.label?.shipmentNumber ?? label?.shipmentNumber;

				if (!shipmentNumber) {
					continue;
				}

				const storedShipment = await shippingRepository.updateByShipmentNumber(
					shipmentNumber,
					buildStoredShipmentUpdateInput({
						label,
						lastKnownStatus: result.labels?.label?.shortDeliveryStatus ?? null,
					}),
				);

				if (storedShipment) {
					storedShipments.push(storedShipment);
				}
			}

			return { upstream, storedShipments };
		},
		checkShipmentEditability: ({ shipmentNumbers }) =>
			shippingGateway.checkShipmentEditability(shipmentNumbers),
		groupShipments: ({ shipmentNumbers }) =>
			shippingGateway.groupShipments(shipmentNumbers),
		cancelShipmentGroup: ({ groupLabel }) =>
			shippingGateway.cancelShipmentGroup(groupLabel),
		async requestCourier({ payload }) {
			const upstream = await shippingGateway.requestCourier(payload);
			const storedShipments: StoredShipmentSummary[] = [];

			for (const shipmentNumber of payload.attachShipments ?? []) {
				const storedShipment = await shippingRepository.updateByShipmentNumber(
					shipmentNumber,
					{
						econtRequestCourierId: upstream.courierRequestID ?? null,
					},
				);

				if (storedShipment) {
					storedShipments.push(storedShipment);
				}
			}

			return { upstream, storedShipments };
		},
		async getShipmentStatuses({ shipmentNumbers }) {
			const upstream =
				await shippingGateway.getShipmentStatuses(shipmentNumbers);

			for (const result of upstream.shipmentStatuses ?? []) {
				const shipmentNumber = result.status?.shipmentNumber;

				if (!shipmentNumber) {
					continue;
				}

				await shippingRepository.updateByShipmentNumber(shipmentNumber, {
					lastKnownStatus: result.status?.shortDeliveryStatus ?? null,
				});
			}

			return upstream;
		},
		getCourierRequestStatuses: ({ requestCourierIds }) =>
			shippingGateway.getCourierRequestStatuses(requestCourierIds),
		getMyAwb: (payload) => shippingGateway.getMyAwb(payload),
		setItuCode: ({ awbBarcode, truckRegNum, ituCode }) =>
			shippingGateway.setItuCode(awbBarcode, truckRegNum, ituCode),
		async trackShipment({ shipmentNumber }) {
			const shipment = await shippingGateway.trackShipment(shipmentNumber);

			if (shipment?.shipmentNumber) {
				await shippingRepository.updateByShipmentNumber(
					shipment.shipmentNumber,
					{
						lastKnownStatus: shipment.shortDeliveryStatus ?? null,
					},
				);
			}

			return shipment;
		},
		getClientProfiles: () => shippingGateway.getClientProfiles(),
		createCdAgreement: (payload) => shippingGateway.createCdAgreement(payload),
		runThreeWayLogistics: (payload) =>
			shippingGateway.runThreeWayLogistics(payload),
		getPaymentReport: (payload) => shippingGateway.getPaymentReport(payload),
		listLocalShipments: ({ userId }) => shippingRepository.listByUserId(userId),
		getLocalShipment: ({ userId, id }) =>
			shippingRepository.findByIdForUser(id, userId),
	};
}

export const createShippingUseCases = createShippingService;

function buildStoredShipmentCreateInput(input: {
	userId: string;
	label: ShippingLabel;
	shipmentNumber: string;
	requestCourierId?: string | null;
	mode?: string | null;
	lastKnownStatus?: string | null;
}): CreateStoredShipmentInput {
	return {
		userId: input.userId,
		econtShipmentNumber: input.shipmentNumber,
		econtRequestCourierId: input.requestCourierId ?? null,
		mode: input.mode ?? null,
		senderName: input.label.senderClient?.name ?? null,
		senderPhone: input.label.senderClient?.phones?.[0] ?? null,
		senderOfficeCode: input.label.senderOfficeCode ?? null,
		senderCityName: input.label.senderAddress?.city?.name ?? null,
		receiverName: input.label.receiverClient?.name ?? null,
		receiverPhone: input.label.receiverClient?.phones?.[0] ?? null,
		receiverOfficeCode: input.label.receiverOfficeCode ?? null,
		receiverCityName: input.label.receiverAddress?.city?.name ?? null,
		shipmentType: input.label.shipmentType ?? null,
		packCount: input.label.packCount ?? null,
		weight: input.label.weight ?? null,
		lastKnownStatus: input.lastKnownStatus ?? null,
		metadata: buildMetadata(input.label),
	};
}

function buildStoredShipmentUpdateInput(input: {
	label: ShippingLabel | undefined;
	lastKnownStatus?: string | null;
}): UpdateStoredShipmentInput {
	return {
		senderName: input.label?.senderClient?.name ?? null,
		senderPhone: input.label?.senderClient?.phones?.[0] ?? null,
		senderOfficeCode: input.label?.senderOfficeCode ?? null,
		senderCityName: input.label?.senderAddress?.city?.name ?? null,
		receiverName: input.label?.receiverClient?.name ?? null,
		receiverPhone: input.label?.receiverClient?.phones?.[0] ?? null,
		receiverOfficeCode: input.label?.receiverOfficeCode ?? null,
		receiverCityName: input.label?.receiverAddress?.city?.name ?? null,
		shipmentType: input.label?.shipmentType ?? null,
		packCount: input.label?.packCount ?? null,
		weight: input.label?.weight ?? null,
		lastKnownStatus: input.lastKnownStatus ?? null,
		metadata: input.label ? buildMetadata(input.label) : null,
	};
}

function buildMetadata(label: ShippingLabel): Record<string, unknown> {
	return {
		orderNumber: label.orderNumber ?? null,
		shipmentDescription: label.shipmentDescription ?? null,
		paymentSenderMethod: label.paymentSenderMethod ?? null,
		paymentReceiverMethod: label.paymentReceiverMethod ?? null,
		packCount: label.packCount ?? null,
	};
}
