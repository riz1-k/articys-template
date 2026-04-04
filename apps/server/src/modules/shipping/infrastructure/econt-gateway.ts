import {
	EcontAPIError,
	EcontAuthenticationError,
	EcontClient,
	EcontNetworkError,
	EcontRateLimitError,
	EcontValidationError,
} from "@alphabite/econt-sdk";
import { STATUS_CODES } from "@/lib/constants";
import type { ShippingGatewayPort } from "@/modules/shipping/application/shipping-gateway.port";
import { AppError } from "@/platform/http/app-error";
import { ErrorCodes } from "@/platform/http/error-codes";

export function createEcontGateway(input: {
	username: string;
	password: string;
	environment: "demo" | "production";
	timeout?: number;
	maxRetries?: number;
}): ShippingGatewayPort {
	const client = new EcontClient({
		username: input.username,
		password: input.password,
		environment: input.environment,
		timeout: input.timeout,
		maxRetries: input.maxRetries,
	});

	return {
		getOffices: (payload) => wrapEcontCall(() => client.offices.list(payload)),
		getOfficeByCode: (officeCode) =>
			wrapEcontCall(() => client.offices.get(officeCode)),
		getCities: (payload) =>
			wrapEcontCall(() => client.offices.getCities(payload)),
		getCountries: () => wrapEcontCall(() => client.offices.getCountries()),
		getStreets: (payload) =>
			wrapEcontCall(() => client.offices.getStreets(payload)),
		getQuarters: (payload) =>
			wrapEcontCall(() => client.offices.getQuarters(payload)),
		validateAddress: (payload) =>
			wrapEcontCall(() => client.address.validateAddress(payload)),
		getAddressServiceTimes: (payload) =>
			wrapEcontCall(() => client.address.addressServiceTimes(payload)),
		getNearestOffices: (payload) =>
			wrapEcontCall(() => client.address.getNearestOffices(payload)),
		calculateShipment: (payload) =>
			wrapEcontCall(() => client.shipments.calculate(payload)),
		validateShipment: (payload) =>
			wrapEcontCall(() => client.shipments.validate(payload)),
		createShipment: (payload, options) =>
			wrapEcontCall(() => client.shipments.createLabel(payload, options)),
		createShipments: (payload, options) =>
			wrapEcontCall(() => client.shipments.createLabels(payload, options)),
		deleteShipments: (shipmentNumbers) =>
			wrapEcontCall(() => client.shipments.deleteLabels(shipmentNumbers)),
		updateShipment: (payload) =>
			wrapEcontCall(() => client.shipments.updateLabel(payload)),
		updateShipments: (payload) =>
			wrapEcontCall(() => client.shipments.updateLabels(payload)),
		checkShipmentEditability: (shipmentNumbers) =>
			wrapEcontCall(() =>
				client.shipments.checkPossibleShipmentEditions(shipmentNumbers),
			),
		groupShipments: (shipmentNumbers) =>
			wrapEcontCall(() => client.shipments.grouping(shipmentNumbers)),
		cancelShipmentGroup: (groupLabel) =>
			wrapEcontCall(() => client.shipments.groupingCancelation(groupLabel)),
		requestCourier: (payload) =>
			wrapEcontCall(() => client.shipments.requestCourier(payload)),
		getShipmentStatuses: (shipmentNumbers) =>
			wrapEcontCall(() =>
				client.shipments.getShipmentStatuses(shipmentNumbers),
			),
		getCourierRequestStatuses: (requestCourierIds) =>
			wrapEcontCall(() =>
				client.shipments.getRequestCourierStatus(requestCourierIds),
			),
		getMyAwb: (payload) =>
			wrapEcontCall(() => client.shipments.getMyAWB(payload)),
		setItuCode: (awbBarcode, truckRegNum, ituCode) =>
			wrapEcontCall(() =>
				client.shipments.setITUCode(awbBarcode, truckRegNum, ituCode),
			),
		trackShipment: (shipmentNumber) =>
			wrapEcontCall(() => client.tracking.trackOne(shipmentNumber)),
		getClientProfiles: () =>
			wrapEcontCall(() => client.profile.getClientProfiles()),
		createCdAgreement: (payload) =>
			wrapEcontCall(() => client.profile.createCDAgreement(payload)),
		runThreeWayLogistics: (payload) =>
			wrapEcontCall(() => client.threeWayLogistics.threeWayLogistics(payload)),
		getPaymentReport: (payload) =>
			wrapEcontCall(() => client.paymentReport.getPaymentReport(payload)),
	};
}

async function wrapEcontCall<T>(callback: () => Promise<T>): Promise<T> {
	try {
		return await callback();
	} catch (error) {
		throw mapEcontError(error);
	}
}

function mapEcontError(error: unknown): AppError {
	if (error instanceof EcontValidationError) {
		return new AppError(
			STATUS_CODES.BAD_REQUEST,
			error.message,
			ErrorCodes.ECONT_BAD_REQUEST,
			{
				field: error.field,
				value: error.value,
			},
		);
	}

	if (error instanceof EcontAuthenticationError) {
		return new AppError(
			STATUS_CODES.BAD_GATEWAY,
			error.message || "Econt authentication failed",
			ErrorCodes.ECONT_AUTH_FAILED,
		);
	}

	if (error instanceof EcontRateLimitError) {
		return new AppError(
			STATUS_CODES.TOO_MANY_REQUESTS,
			error.message || "Econt rate limit exceeded",
			ErrorCodes.ECONT_RATE_LIMITED,
			{
				retryAfter: error.retryAfter,
			},
		);
	}

	if (error instanceof EcontNetworkError) {
		return new AppError(
			STATUS_CODES.SERVICE_UNAVAILABLE,
			error.message || "Econt is unavailable",
			ErrorCodes.ECONT_UPSTREAM_UNAVAILABLE,
		);
	}

	if (error instanceof EcontAPIError) {
		return new AppError(
			mapStatusCode(error.statusCode),
			error.message || "Econt request failed",
			error.statusCode && error.statusCode < STATUS_CODES.INTERNAL_SERVER_ERROR
				? ErrorCodes.ECONT_BAD_REQUEST
				: ErrorCodes.ECONT_UPSTREAM_ERROR,
			{
				statusCode: error.statusCode,
				requestId: error.requestId,
				response: error.response,
			},
		);
	}

	if (error instanceof AppError) {
		return error;
	}

	return new AppError(
		STATUS_CODES.INTERNAL_SERVER_ERROR,
		"Econt request failed unexpectedly",
		ErrorCodes.ECONT_UPSTREAM_ERROR,
	);
}

function mapStatusCode(statusCode?: number) {
	if (!statusCode) {
		return STATUS_CODES.BAD_GATEWAY;
	}

	if (statusCode >= STATUS_CODES.INTERNAL_SERVER_ERROR) {
		return STATUS_CODES.BAD_GATEWAY;
	}

	if (
		statusCode === STATUS_CODES.UNAUTHORIZED ||
		statusCode === STATUS_CODES.FORBIDDEN
	) {
		return STATUS_CODES.BAD_GATEWAY;
	}

	if (statusCode === STATUS_CODES.TOO_MANY_REQUESTS) {
		return STATUS_CODES.TOO_MANY_REQUESTS;
	}

	return STATUS_CODES.BAD_REQUEST;
}
