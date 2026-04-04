import { ShipmentType } from "@alphabite/econt-sdk";
import { describe, expect, it, vi } from "vitest";
import { createShippingUseCases } from "./create-shipping-use-cases";

describe("createShippingUseCases", () => {
	it("persists created shipments locally", async () => {
		const shippingRepository = {
			create: vi.fn(async (input) => ({
				id: "ship_local_1",
				createdAt: new Date("2026-01-01T00:00:00.000Z"),
				updatedAt: new Date("2026-01-01T00:00:00.000Z"),
				...input,
				econtRequestCourierId: input.econtRequestCourierId ?? null,
				mode: input.mode ?? null,
				senderName: input.senderName ?? null,
				senderPhone: input.senderPhone ?? null,
				senderOfficeCode: input.senderOfficeCode ?? null,
				senderCityName: input.senderCityName ?? null,
				receiverName: input.receiverName ?? null,
				receiverPhone: input.receiverPhone ?? null,
				receiverOfficeCode: input.receiverOfficeCode ?? null,
				receiverCityName: input.receiverCityName ?? null,
				shipmentType: input.shipmentType ?? null,
				packCount: input.packCount ?? null,
				weight: input.weight ?? null,
				lastKnownStatus: input.lastKnownStatus ?? null,
				metadata: input.metadata ?? null,
			})),
			findByIdForUser: vi.fn(),
			listByUserId: vi.fn(),
			findByShipmentNumber: vi.fn(),
			updateByShipmentNumber: vi.fn(),
		};
		const shippingGateway = {
			getOffices: vi.fn(),
			getOfficeByCode: vi.fn(),
			getCities: vi.fn(),
			getCountries: vi.fn(),
			getStreets: vi.fn(),
			getQuarters: vi.fn(),
			validateAddress: vi.fn(),
			getAddressServiceTimes: vi.fn(),
			getNearestOffices: vi.fn(),
			calculateShipment: vi.fn(),
			validateShipment: vi.fn(),
			createShipment: vi.fn(async () => ({
				label: {
					shipmentNumber: "1234567890",
					shortDeliveryStatus: "Created",
					rejectOriginalParcelPaySide: "",
					rejectReturnParcelPaySide: "",
					shipmentEdition: {
						shipmentNum: 1,
						editionNum: 1,
						editionType: "create",
						editionError: "",
						price: "0",
						currency: "BGN",
					},
					previousShipment: {
						shipmentNumber: 1,
						reason: "",
						pdfURL: "",
					},
					shortDeliveryStatusEn: "Created",
				},
				courierRequestID: 77,
				payAfterAcceptIgnored: "",
			})),
			createShipments: vi.fn(),
			deleteShipments: vi.fn(),
			updateShipment: vi.fn(),
			updateShipments: vi.fn(),
			checkShipmentEditability: vi.fn(),
			groupShipments: vi.fn(),
			cancelShipmentGroup: vi.fn(),
			requestCourier: vi.fn(),
			getShipmentStatuses: vi.fn(),
			getCourierRequestStatuses: vi.fn(),
			getMyAwb: vi.fn(),
			setItuCode: vi.fn(),
			trackShipment: vi.fn(),
			getClientProfiles: vi.fn(),
			createCdAgreement: vi.fn(),
			runThreeWayLogistics: vi.fn(),
			getPaymentReport: vi.fn(),
		};
		const useCases = createShippingUseCases({
			shippingGateway: shippingGateway as never,
			shippingRepository: shippingRepository as never,
		});

		const result = await useCases.createShipment({
			userId: "user-1",
			label: {
				senderClient: {
					name: "Sender",
					phones: ["+359888111111"],
				},
				receiverClient: {
					name: "Receiver",
					phones: ["+359888222222"],
				},
				packCount: 2,
				weight: 1.5,
				shipmentType: ShipmentType.PACK,
			},
		});

		expect(shippingRepository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				userId: "user-1",
				econtShipmentNumber: "1234567890",
				econtRequestCourierId: "77",
				senderName: "Sender",
				receiverName: "Receiver",
				lastKnownStatus: "Created",
			}),
		);
		expect(result.storedShipment?.econtShipmentNumber).toBe("1234567890");
	});

	it("updates locally stored shipment status from tracking status calls", async () => {
		const shippingRepository = {
			create: vi.fn(),
			findByIdForUser: vi.fn(),
			listByUserId: vi.fn(),
			findByShipmentNumber: vi.fn(),
			updateByShipmentNumber: vi.fn(async () => null),
		};
		const shippingGateway = {
			getOffices: vi.fn(),
			getOfficeByCode: vi.fn(),
			getCities: vi.fn(),
			getCountries: vi.fn(),
			getStreets: vi.fn(),
			getQuarters: vi.fn(),
			validateAddress: vi.fn(),
			getAddressServiceTimes: vi.fn(),
			getNearestOffices: vi.fn(),
			calculateShipment: vi.fn(),
			validateShipment: vi.fn(),
			createShipment: vi.fn(),
			createShipments: vi.fn(),
			deleteShipments: vi.fn(),
			updateShipment: vi.fn(),
			updateShipments: vi.fn(),
			checkShipmentEditability: vi.fn(),
			groupShipments: vi.fn(),
			cancelShipmentGroup: vi.fn(),
			requestCourier: vi.fn(),
			getShipmentStatuses: vi.fn(async () => ({
				shipmentStatuses: [
					{
						status: {
							shipmentNumber: "1234567890",
							shortDeliveryStatus: "In transit",
							rejectOriginalParcelPaySide: "",
							rejectReturnParcelPaySide: "",
							shipmentEdition: {
								shipmentNum: 1,
								editionNum: 1,
								editionType: "status",
								editionError: "",
								price: "0",
								currency: "BGN",
							},
							previousShipment: {
								shipmentNumber: 1,
								reason: "",
								pdfURL: "",
							},
							shortDeliveryStatusEn: "In transit",
						},
					},
				],
			})),
			getCourierRequestStatuses: vi.fn(),
			getMyAwb: vi.fn(),
			setItuCode: vi.fn(),
			trackShipment: vi.fn(),
			getClientProfiles: vi.fn(),
			createCdAgreement: vi.fn(),
			runThreeWayLogistics: vi.fn(),
			getPaymentReport: vi.fn(),
		};
		const useCases = createShippingUseCases({
			shippingGateway: shippingGateway as never,
			shippingRepository: shippingRepository as never,
		});

		await useCases.getShipmentStatuses({
			shipmentNumbers: ["1234567890"],
		});

		expect(shippingRepository.updateByShipmentNumber).toHaveBeenCalledWith(
			"1234567890",
			{
				lastKnownStatus: "In transit",
			},
		);
	});
});
