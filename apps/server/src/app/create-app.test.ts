import { describe, expect, it, vi } from "vitest";
import { type AppDependencies, createApp } from "./create-app";

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_NO_CONTENT = 204;
const HTTP_UNAUTHORIZED = 401;
const HTTP_BAD_REQUEST = 400;
const TODO_ID = "V1StGXR8_Z5jdHi6B-myT";

function createTestDependencies(): AppDependencies {
	return {
		auth: {
			handler: vi.fn(),
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
				}) => ({
					id: "550e8400-e29b-41d4-a716-446655440001",
					userId,
					title,
					description: description ?? null,
					completed: false,
					createdAt: new Date("2026-01-01T00:00:00.000Z"),
					updatedAt: new Date("2026-01-01T00:00:00.000Z"),
				}),
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
});
