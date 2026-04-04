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
import type { Hono } from "hono";
import { created, success } from "@/core/http/api-response";
import { AppError } from "@/core/http/app-error";
import { ErrorCodes } from "@/core/http/error-codes";
import { getCurrentUser, requireAuth } from "@/core/http/require-auth";
import {
	validateBody,
	validateParams,
	validateQuery,
} from "@/core/http/validation";
import type { IdentitySessionService } from "@/features/auth";
import type { ShippingUseCases } from "@/features/shipping";
import { STATUS_CODES } from "@/lib/constants";
import {
	addressServiceTimesBodySchema,
	calculateShipmentBodySchema,
	citiesQuerySchema,
	createCdAgreementBodySchema,
	createShipmentBodySchema,
	createShipmentsBodySchema,
	getMyAwbBodySchema,
	groupCancelBodySchema,
	groupShipmentsBodySchema,
	localShipmentIdParamsSchema,
	nearestOfficesBodySchema,
	officeCodeParamsSchema,
	officesQuerySchema,
	paymentReportBodySchema,
	quartersQuerySchema,
	requestCourierBodySchema,
	requestCourierStatusBodySchema,
	setItuCodeBodySchema,
	shipmentNumberListBodySchema,
	shipmentNumbersBodySchema,
	streetsQuerySchema,
	threeWayLogisticsBodySchema,
	trackingParamsSchema,
	updateShipmentBodySchema,
	updateShipmentsBodySchema,
	validateAddressBodySchema,
} from "./schemas";

function getValidatedValue<T>(
	c: { get(key: string): unknown },
	key: string,
): T {
	return c.get(key) as T;
}

export function registerShippingRoutes(
	app: Hono,
	identitySessionService: IdentitySessionService,
	shippingUseCases: ShippingUseCases,
) {
	const auth = requireAuth(identitySessionService);

	app.get(
		"/api/shipping/econt/offices",
		auth,
		validateQuery(officesQuerySchema),
		async (c) => {
			const query = getValidatedValue<GetOfficesRequest>(c, "validatedQuery");
			return success(c, await shippingUseCases.getOffices(query));
		},
	);

	app.get(
		"/api/shipping/econt/offices/:officeCode",
		auth,
		validateParams(officeCodeParamsSchema),
		async (c) => {
			const params = getValidatedValue<{ officeCode: string }>(
				c,
				"validatedParams",
			);
			const office = await shippingUseCases.getOfficeByCode(params.officeCode);

			if (!office) {
				throw new AppError(
					STATUS_CODES.NOT_FOUND,
					"Office not found",
					ErrorCodes.NOT_FOUND,
				);
			}

			return success(c, office);
		},
	);

	app.get(
		"/api/shipping/econt/cities",
		auth,
		validateQuery(citiesQuerySchema),
		async (c) => {
			return success(
				c,
				await shippingUseCases.getCities(
					getValidatedValue(c, "validatedQuery") as {
						countryCode: string;
						cityId?: string | number;
					},
				),
			);
		},
	);

	app.get("/api/shipping/econt/countries", auth, async (c) => {
		return success(c, await shippingUseCases.getCountries());
	});

	app.get(
		"/api/shipping/econt/streets",
		auth,
		validateQuery(streetsQuerySchema),
		async (c) => {
			return success(
				c,
				await shippingUseCases.getStreets(
					getValidatedValue<GetStreetsRequest>(c, "validatedQuery"),
				),
			);
		},
	);

	app.get(
		"/api/shipping/econt/quarters",
		auth,
		validateQuery(quartersQuerySchema),
		async (c) => {
			return success(
				c,
				await shippingUseCases.getQuarters(
					getValidatedValue<{ cityID?: string | number }>(c, "validatedQuery"),
				),
			);
		},
	);

	app.post(
		"/api/shipping/econt/address/validate",
		auth,
		validateBody(validateAddressBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.validateAddress(
					getValidatedValue<ValidateAddressRequest>(c, "validatedBody"),
				),
			),
	);

	app.post(
		"/api/shipping/econt/address/service-times",
		auth,
		validateBody(addressServiceTimesBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.getAddressServiceTimes(
					getValidatedValue<AddressServiceTimesRequest>(c, "validatedBody"),
				),
			),
	);

	app.post(
		"/api/shipping/econt/address/nearest-offices",
		auth,
		validateBody(nearestOfficesBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.getNearestOffices(
					getValidatedValue<GetNearestOfficesRequest>(c, "validatedBody"),
				),
			),
	);

	app.post(
		"/api/shipping/econt/shipments/calculate",
		auth,
		validateBody(calculateShipmentBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.calculateShipment(
					getValidatedValue<ShippingLabel>(c, "validatedBody"),
				),
			),
	);

	app.post(
		"/api/shipping/econt/shipments/validate",
		auth,
		validateBody(calculateShipmentBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.validateShipment(
					getValidatedValue<ShippingLabel>(c, "validatedBody"),
				),
			),
	);

	app.post(
		"/api/shipping/econt/shipments",
		auth,
		validateBody(createShipmentBodySchema),
		async (c) => {
			const currentUser = getCurrentUser(c);
			const body = getValidatedValue<{
				label: ShippingLabel;
				options?: {
					requestCourierTimeFrom?: string;
					requestCourierTimeTo?: string;
					mode?: "calculate" | "validate" | "create" | "calculate_with_block";
				};
			}>(c, "validatedBody");

			return created(
				c,
				await shippingUseCases.createShipment({
					userId: currentUser.id,
					label: body.label,
					options: body.options,
				}),
			);
		},
	);

	app.post(
		"/api/shipping/econt/shipments/bulk",
		auth,
		validateBody(createShipmentsBodySchema),
		async (c) => {
			const currentUser = getCurrentUser(c);
			const body = getValidatedValue<{
				labels: ShippingLabel[];
				options?: {
					runAsyncAndEmailResultTo?: string;
					mode?: "validate" | "calculate" | "create";
				};
			}>(c, "validatedBody");

			return created(
				c,
				await shippingUseCases.createShipments({
					userId: currentUser.id,
					labels: body.labels,
					options: body.options,
				}),
			);
		},
	);

	app.post(
		"/api/shipping/econt/shipments/delete",
		auth,
		validateBody(shipmentNumbersBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.deleteShipments(
					getValidatedValue<{ shipmentNumbers: string[] }>(c, "validatedBody"),
				),
			),
	);

	app.post(
		"/api/shipping/econt/shipments/update",
		auth,
		validateBody(updateShipmentBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.updateShipment({
					payload: getValidatedValue<{
						payload: UpdateLabelRequestData;
					}>(c, "validatedBody").payload,
				}),
			),
	);

	app.post(
		"/api/shipping/econt/shipments/update-bulk",
		auth,
		validateBody(updateShipmentsBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.updateShipments({
					payload: getValidatedValue<{
						payload: UpdateLabelsRequest;
					}>(c, "validatedBody").payload,
				}),
			),
	);

	app.post(
		"/api/shipping/econt/shipments/editability",
		auth,
		validateBody(shipmentNumberListBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.checkShipmentEditability({
					shipmentNumbers: getValidatedValue<{ shipmentNumbers: number[] }>(
						c,
						"validatedBody",
					).shipmentNumbers,
				}),
			),
	);

	app.post(
		"/api/shipping/econt/shipments/group",
		auth,
		validateBody(groupShipmentsBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.groupShipments(
					getValidatedValue<{ shipmentNumbers: number[] }>(c, "validatedBody"),
				),
			),
	);

	app.post(
		"/api/shipping/econt/shipments/group-cancel",
		auth,
		validateBody(groupCancelBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.cancelShipmentGroup(
					getValidatedValue<{ groupLabel: number }>(c, "validatedBody"),
				),
			),
	);

	app.post(
		"/api/shipping/econt/shipments/courier-request",
		auth,
		validateBody(requestCourierBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.requestCourier({
					payload: getValidatedValue<{
						payload: RequestCourierRequest;
					}>(c, "validatedBody").payload,
				}),
			),
	);

	app.post(
		"/api/shipping/econt/shipments/courier-request-status",
		auth,
		validateBody(requestCourierStatusBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.getCourierRequestStatuses(
					getValidatedValue<{ requestCourierIds: string[] }>(
						c,
						"validatedBody",
					),
				),
			),
	);

	app.post(
		"/api/shipping/econt/shipments/statuses",
		auth,
		validateBody(shipmentNumbersBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.getShipmentStatuses(
					getValidatedValue<{ shipmentNumbers: string[] }>(c, "validatedBody"),
				),
			),
	);

	app.post(
		"/api/shipping/econt/shipments/awb",
		auth,
		validateBody(getMyAwbBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.getMyAwb(
					getValidatedValue<GetMyAWBRequest>(c, "validatedBody"),
				),
			),
	);

	app.post(
		"/api/shipping/econt/shipments/itu-code",
		auth,
		validateBody(setItuCodeBodySchema),
		async (c) => {
			const body = getValidatedValue<{
				awbBarcode: string;
				truckRegNum: string;
				ituCode: string;
			}>(c, "validatedBody");

			return success(
				c,
				await shippingUseCases.setItuCode({
					awbBarcode: body.awbBarcode,
					truckRegNum: body.truckRegNum,
					ituCode: body.ituCode,
				}),
			);
		},
	);

	app.get(
		"/api/shipping/econt/tracking/:shipmentNumber",
		auth,
		validateParams(trackingParamsSchema),
		async (c) => {
			const params = getValidatedValue<{ shipmentNumber: string }>(
				c,
				"validatedParams",
			);
			const tracking = await shippingUseCases.trackShipment({
				shipmentNumber: params.shipmentNumber,
			});

			if (!tracking) {
				throw new AppError(
					STATUS_CODES.NOT_FOUND,
					"Shipment not found",
					ErrorCodes.NOT_FOUND,
				);
			}

			return success(c, tracking);
		},
	);

	app.get("/api/shipping/econt/profile/client-profiles", auth, async (c) =>
		success(c, await shippingUseCases.getClientProfiles()),
	);

	app.post(
		"/api/shipping/econt/profile/cd-agreement",
		auth,
		validateBody(createCdAgreementBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.createCdAgreement(
					getValidatedValue<CreateCDAgreementRequest>(c, "validatedBody"),
				),
			),
	);

	app.post(
		"/api/shipping/econt/three-way-logistics",
		auth,
		validateBody(threeWayLogisticsBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.runThreeWayLogistics(
					getValidatedValue<ThreeWayLogisticsRequest>(c, "validatedBody"),
				),
			),
	);

	app.post(
		"/api/shipping/econt/payment-report",
		auth,
		validateBody(paymentReportBodySchema),
		async (c) =>
			success(
				c,
				await shippingUseCases.getPaymentReport(
					getValidatedValue<PaymentReportRequest>(c, "validatedBody"),
				),
			),
	);

	app.get("/api/shipping/econt/shipments/local", auth, async (c) => {
		const currentUser = getCurrentUser(c);
		return success(
			c,
			await shippingUseCases.listLocalShipments({ userId: currentUser.id }),
		);
	});

	app.get(
		"/api/shipping/econt/shipments/local/:id",
		auth,
		validateParams(localShipmentIdParamsSchema),
		async (c) => {
			const currentUser = getCurrentUser(c);
			const params = getValidatedValue<{ id: string }>(c, "validatedParams");
			const shipment = await shippingUseCases.getLocalShipment({
				userId: currentUser.id,
				id: params.id,
			});

			if (!shipment) {
				throw new AppError(
					STATUS_CODES.NOT_FOUND,
					"Shipment not found",
					ErrorCodes.NOT_FOUND,
				);
			}

			return success(c, shipment);
		},
	);
}
