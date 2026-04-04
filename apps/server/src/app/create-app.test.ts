import { describe, expect, it, vi } from "vitest";
import { FREE_TODO_LIMIT } from "@/modules/billing/domain/todo-entitlement";
import { TodoLimitExceededError } from "@/modules/todos/domain/todo-limit-exceeded.error";
import { type AppDependencies, createApp } from "./create-app";

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_NO_CONTENT = 204;
const HTTP_UNAUTHORIZED = 401;
const HTTP_BAD_REQUEST = 400;
const HTTP_FORBIDDEN = 403;
const TODO_ID = "V1StGXR8_Z5jdHi6B-myT";

function createTestDependencies(options?: {
	createTodoError?: Error;
}): AppDependencies {
	return {
		auth: {
			handler: vi.fn(),
		},
		billingUseCases: {
			getTodoEntitlement: vi.fn(async ({ currentTodoCount }) => ({
				hasActiveSubscription: false,
				maxTodos: FREE_TODO_LIMIT,
				currentTodoCount,
				canCreateMoreTodos: currentTodoCount < FREE_TODO_LIMIT,
			})),
			getBillingStatus: vi.fn(async () => ({
				customerId: "cus_123",
				subscription: {
					plan: "monthly" as const,
					status: "active" as const,
					cancelAtPeriodEnd: false,
					currentPeriodEnd: "2026-02-01T00:00:00.000Z",
				},
				entitlement: {
					hasActiveSubscription: true,
					maxTodos: null,
					currentTodoCount: 7,
					canCreateMoreTodos: true,
				},
			})),
			createCheckoutSession: vi.fn(async () => ({
				sessionId: "cs_test_123",
				url: "https://checkout.stripe.com/c/pay/cs_test_123",
			})),
			createBillingPortalSession: vi.fn(async () => ({
				url: "https://billing.stripe.com/session/test",
			})),
			handleStripeWebhook: vi.fn(async () => {}),
		},
		healthStatusService: {
			getStatus: vi.fn(async () => ({
				status: "ok" as const,
				checks: { database: "ok" as const, cache: "disabled" as const },
				timestamp: new Date().toISOString(),
			})),
		},
		http: {
			cors: async (_c, next) => {
				await next();
			},
			rateLimiter: async (_c, next) => {
				await next();
			},
			requestLogger: async (_c, next) => {
				await next();
			},
			securityHeaders: async (_c, next) => {
				await next();
			},
		},
		identitySessionService: {
			getCurrentSession: vi.fn(async (headers: Headers) => {
				if (headers.get("authorization") !== "Bearer test-user") {
					return null;
				}

				return {
					user: {
						id: "user-1",
						email: "test@example.com",
						name: "Test User",
						image: null,
						emailVerified: true,
					},
					session: {
						id: "session-1",
						userId: "user-1",
						expiresAt: new Date("2030-01-01T00:00:00.000Z"),
						ipAddress: null,
						userAgent: "vitest",
					},
				};
			}),
		},
		shippingUseCases: {
			getOffices: vi.fn(async () => []),
			getOfficeByCode: vi.fn(async () => null),
			getCities: vi.fn(async () => []),
			getCountries: vi.fn(async () => []),
			getStreets: vi.fn(async () => []),
			getQuarters: vi.fn(async () => []),
			validateAddress: vi.fn(async () => ({})),
			getAddressServiceTimes: vi.fn(async () => ({
				serviceOffice: {
					id: 1,
					code: "1000",
					isMPS: false,
					isAPS: false,
					name: "Office",
					nameEn: "Office",
					phones: [],
					emails: [],
					address: {
						id: null,
						city: {
							id: 1,
							country: {
								id: 1,
								code2: "BG",
								code3: "BGR",
								name: "Bulgaria",
								nameEn: "Bulgaria",
								isEU: true,
							},
							postCode: "1000",
							name: "Sofia",
							nameEn: "Sofia",
							regionName: null,
							regionNameEn: null,
							phoneCode: null,
							location: null,
							expressCityDeliveries: true,
							monday: true,
							tuesday: true,
							wednesday: true,
							thursday: true,
							friday: true,
							saturday: false,
							sunday: false,
							serviceDays: 5,
							zoneId: null,
							zoneName: null,
							zoneNameEn: null,
							servingOffices: [],
						},
						fullAddress: "Address",
						fullAddressEn: "Address",
						quarter: null,
						street: null,
						num: "1",
						other: "",
						location: null,
						zip: null,
						hezid: null,
					},
					info: "",
					currency: "BGN",
					language: null,
					normalBusinessHoursFrom: 900,
					normalBusinessHoursTo: 1800,
					halfDayBusinessHoursFrom: 900,
					halfDayBusinessHoursTo: 1300,
					shipmentTypes: [],
					partnerCode: "",
					hubCode: "",
					hubName: "",
					hubNameEn: "",
					isDrive: false,
				},
				serviceOfficeLatitude: 0,
				serviceOfficeLongitude: 0,
			})),
			getNearestOffices: vi.fn(async () => ({})),
			calculateShipment: vi.fn(async () => ({
				payAfterAcceptIgnored: "",
			})),
			validateShipment: vi.fn(async () => ({
				payAfterAcceptIgnored: "",
			})),
			createShipment: vi.fn(async () => ({
				upstream: { payAfterAcceptIgnored: "" },
				storedShipment: null,
			})),
			createShipments: vi.fn(async () => ({
				upstream: {},
				storedShipments: [],
			})),
			deleteShipments: vi.fn(async () => ({})),
			updateShipment: vi.fn(async () => ({
				upstream: {
					label: {
						rejectOriginalParcelPaySide: "",
						rejectReturnParcelPaySide: "",
						shipmentEdition: {
							shipmentNum: 1,
							editionNum: 1,
							editionType: "edit",
							editionError: "",
							price: "0",
							currency: "BGN",
						},
						previousShipment: {
							shipmentNumber: 1,
							reason: "",
							pdfURL: "",
						},
						shortDeliveryStatus: "Created",
						shortDeliveryStatusEn: "Created",
					},
				},
				storedShipment: null,
			})),
			updateShipments: vi.fn(async () => ({
				upstream: {},
				storedShipments: [],
			})),
			checkShipmentEditability: vi.fn(async () => ({})),
			groupShipments: vi.fn(async () => ({
				label: {
					rejectOriginalParcelPaySide: "",
					rejectReturnParcelPaySide: "",
					shipmentEdition: {
						shipmentNum: 1,
						editionNum: 1,
						editionType: "group",
						editionError: "",
						price: "0",
						currency: "BGN",
					},
					previousShipment: {
						shipmentNumber: 1,
						reason: "",
						pdfURL: "",
					},
					shortDeliveryStatus: "Created",
					shortDeliveryStatusEn: "Created",
				},
			})),
			cancelShipmentGroup: vi.fn(async () => ({
				status: "ok",
			})),
			requestCourier: vi.fn(async () => ({
				upstream: {},
				storedShipments: [],
			})),
			getShipmentStatuses: vi.fn(async () => ({})),
			getCourierRequestStatuses: vi.fn(async () => ({})),
			getMyAwb: vi.fn(async () => ({
				dateFrom: "2026-01-01",
				dateTo: "2026-01-31",
				page: 1,
				totalPages: 1,
				results: [],
			})),
			setItuCode: vi.fn(async () => ({})),
			trackShipment: vi.fn(async () => null),
			getClientProfiles: vi.fn(async () => ({})),
			createCdAgreement: vi.fn(async () => ({})),
			runThreeWayLogistics: vi.fn(async () => ({})),
			getPaymentReport: vi.fn(async () => ({})),
			listLocalShipments: vi.fn(async () => []),
			getLocalShipment: vi.fn(async () => null),
		},
		todoUseCases: {
			listTodos: vi.fn(async ({ userId }: { userId: string }) => [
				{
					id: TODO_ID,
					userId,
					title: "Write integration tests",
					description: null,
					completed: false,
					createdAt: new Date("2026-01-01T00:00:00.000Z"),
					updatedAt: new Date("2026-01-01T00:00:00.000Z"),
				},
			]),
			createTodo: vi.fn(
				async ({
					userId,
					title,
					description,
				}: {
					userId: string;
					title: string;
					description?: string | null;
				}) => {
					if (options?.createTodoError) {
						throw options.createTodoError;
					}

					return {
						id: "550e8400-e29b-41d4-a716-446655440001",
						userId,
						title,
						description: description ?? null,
						completed: false,
						createdAt: new Date("2026-01-01T00:00:00.000Z"),
						updatedAt: new Date("2026-01-01T00:00:00.000Z"),
					};
				},
			),
			getTodo: vi.fn(
				async ({ id, userId }: { id: string; userId: string }) => ({
					id,
					userId,
					title: "Write integration tests",
					description: null,
					completed: false,
					createdAt: new Date("2026-01-01T00:00:00.000Z"),
					updatedAt: new Date("2026-01-01T00:00:00.000Z"),
				}),
			),
			updateTodo: vi.fn(
				async ({
					id,
					userId,
					title,
					description,
					completed,
				}: {
					id: string;
					userId: string;
					title?: string;
					description?: string | null;
					completed?: boolean;
				}) => ({
					id,
					userId,
					title: title ?? "Write integration tests",
					description: description ?? null,
					completed: completed ?? false,
					createdAt: new Date("2026-01-01T00:00:00.000Z"),
					updatedAt: new Date("2026-01-02T00:00:00.000Z"),
				}),
			),
			deleteTodo: vi.fn(async () => true),
		},
	};
}

describe("createApp todo routes", () => {
	it("rejects unauthenticated todo access", async () => {
		const app = createApp(createTestDependencies());

		const response = await app.request("http://localhost/api/todos");

		expect(response.status).toBe(HTTP_UNAUTHORIZED);
	});

	it("supports authenticated todo CRUD flow", async () => {
		const app = createApp(createTestDependencies());
		const headers = new Headers({
			authorization: "Bearer test-user",
			"content-type": "application/json",
		});

		const listResponse = await app.request("http://localhost/api/todos", {
			headers,
		});
		expect(listResponse.status).toBe(HTTP_OK);

		const createResponse = await app.request("http://localhost/api/todos", {
			method: "POST",
			headers,
			body: JSON.stringify({ title: "Ship it", description: "DDD demo" }),
		});
		expect(createResponse.status).toBe(HTTP_CREATED);

		const getResponse = await app.request(
			`http://localhost/api/todos/${TODO_ID}`,
			{
				headers,
			},
		);
		expect(getResponse.status).toBe(HTTP_OK);

		const patchResponse = await app.request(
			`http://localhost/api/todos/${TODO_ID}`,
			{
				method: "PATCH",
				headers,
				body: JSON.stringify({ completed: true }),
			},
		);
		expect(patchResponse.status).toBe(HTTP_OK);

		const deleteResponse = await app.request(
			`http://localhost/api/todos/${TODO_ID}`,
			{
				method: "DELETE",
				headers,
			},
		);
		expect(deleteResponse.status).toBe(HTTP_NO_CONTENT);
	});

	it("returns a bad request for malformed JSON payloads", async () => {
		const app = createApp(createTestDependencies());
		const response = await app.request("http://localhost/api/todos", {
			method: "POST",
			headers: {
				authorization: "Bearer test-user",
				"content-type": "application/json",
			},
			body: "{",
		});

		expect(response.status).toBe(HTTP_BAD_REQUEST);
		await expect(response.json()).resolves.toMatchObject({
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "Malformed JSON request body",
			},
		});
	});

	it("returns a subscription-required error when todo creation is over the free limit", async () => {
		const app = createApp(
			createTestDependencies({
				createTodoError: new TodoLimitExceededError(FREE_TODO_LIMIT),
			}),
		);
		const response = await app.request("http://localhost/api/todos", {
			method: "POST",
			headers: {
				authorization: "Bearer test-user",
				"content-type": "application/json",
			},
			body: JSON.stringify({ title: "Todo 6" }),
		});

		expect(response.status).toBe(HTTP_FORBIDDEN);
		await expect(response.json()).resolves.toMatchObject({
			success: false,
			error: {
				code: "SUBSCRIPTION_REQUIRED",
			},
		});
	});
});

describe("createApp billing routes", () => {
	it("returns billing status for authenticated users", async () => {
		const app = createApp(createTestDependencies());
		const response = await app.request("http://localhost/api/billing/status", {
			headers: {
				authorization: "Bearer test-user",
			},
		});

		expect(response.status).toBe(HTTP_OK);
		await expect(response.json()).resolves.toMatchObject({
			success: true,
			data: {
				subscription: {
					plan: "monthly",
					status: "active",
				},
			},
		});
	});

	it("creates a checkout session for authenticated users", async () => {
		const app = createApp(createTestDependencies());
		const response = await app.request(
			"http://localhost/api/billing/checkout-session",
			{
				method: "POST",
				headers: {
					authorization: "Bearer test-user",
					"content-type": "application/json",
				},
				body: JSON.stringify({ plan: "yearly" }),
			},
		);

		expect(response.status).toBe(HTTP_OK);
		await expect(response.json()).resolves.toMatchObject({
			success: true,
			data: {
				sessionId: "cs_test_123",
			},
		});
	});

	it("rejects webhook requests without a Stripe signature", async () => {
		const app = createApp(createTestDependencies());
		const response = await app.request(
			"http://localhost/api/billing/webhooks/stripe",
			{
				method: "POST",
				body: "{}",
			},
		);

		expect(response.status).toBe(HTTP_BAD_REQUEST);
	});
});
