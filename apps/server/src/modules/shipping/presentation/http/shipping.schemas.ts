import { z } from "zod";

const passthroughObjectSchema = z.object({}).passthrough();

export const officeCodeParamsSchema = z.object({
	officeCode: z.string().trim().min(1),
});

export const localShipmentIdParamsSchema = z.object({
	id: z.nanoid(),
});

export const officesQuerySchema = z
	.object({
		countryCode: z.string().trim().min(1).optional(),
		cityId: z.coerce.number().int().positive().optional(),
		officeCode: z.string().trim().min(1).optional(),
	})
	.refine(
		(value) =>
			value.countryCode !== undefined ||
			value.cityId !== undefined ||
			value.officeCode !== undefined,
		{
			message: "At least one filter must be provided",
		},
	);

export const citiesQuerySchema = z.object({
	countryCode: z.string().trim().min(1),
	cityId: z.coerce.number().int().positive().optional(),
});

export const streetsQuerySchema = z.object({
	cityID: z.coerce.number().int().positive(),
	streetName: z.string().trim().min(1).optional(),
});

export const quartersQuerySchema = z.object({
	cityID: z.coerce.number().int().positive(),
});

export const shipmentNumbersBodySchema = z.object({
	shipmentNumbers: z.array(z.string().trim().min(1)).min(1),
});

export const shipmentNumberListBodySchema = z.object({
	shipmentNumbers: z.array(z.coerce.number().int().positive()).min(1),
});

export const requestCourierStatusBodySchema = z.object({
	requestCourierIds: z.array(z.string().trim().min(1)).min(1),
});

export const groupShipmentsBodySchema = z.object({
	shipmentNumbers: z.array(z.coerce.number().int().positive()).min(1),
});

export const groupCancelBodySchema = z.object({
	groupLabel: z.coerce.number().int().positive(),
});

export const setItuCodeBodySchema = z.object({
	awbBarcode: z.string().trim().min(1),
	truckRegNum: z.string().trim().min(1),
	ituCode: z.string().trim().min(1),
});

export const getMyAwbBodySchema = z.object({
	dateFrom: z.string().trim().min(1),
	dateTo: z.string().trim().min(1),
	page: z.coerce.number().int().positive().optional(),
	side: z.string().trim().min(1),
});

export const createShipmentBodySchema = z.object({
	label: passthroughObjectSchema,
	options: z
		.object({
			requestCourierTimeFrom: z.string().trim().min(1).optional(),
			requestCourierTimeTo: z.string().trim().min(1).optional(),
			mode: z
				.enum(["calculate", "validate", "create", "calculate_with_block"])
				.optional(),
		})
		.optional(),
});

export const createShipmentsBodySchema = z.object({
	labels: z.array(passthroughObjectSchema).min(1),
	options: z
		.object({
			runAsyncAndEmailResultTo: z.email().optional(),
			mode: z.enum(["validate", "calculate", "create"]).optional(),
		})
		.optional(),
});

export const updateShipmentBodySchema = z.object({
	payload: passthroughObjectSchema,
});

export const updateShipmentsBodySchema = z.object({
	payload: passthroughObjectSchema,
});

export const validateAddressBodySchema = passthroughObjectSchema;
export const addressServiceTimesBodySchema = passthroughObjectSchema;
export const nearestOfficesBodySchema = passthroughObjectSchema;
export const calculateShipmentBodySchema = passthroughObjectSchema;
export const createCdAgreementBodySchema = passthroughObjectSchema;
export const requestCourierBodySchema = z.object({
	payload: passthroughObjectSchema,
});
export const paymentReportBodySchema = passthroughObjectSchema;
export const threeWayLogisticsBodySchema = passthroughObjectSchema;

export const trackingParamsSchema = z.object({
	shipmentNumber: z.string().trim().min(1),
});
