import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";

const RATE_LIMIT_WINDOW_MS = 1000;
const REQUEST_COUNT_BELOW_LIMIT = 1;
const REQUEST_COUNT_ABOVE_LIMIT = 2;
const MAX_REQUESTS = 5;
const STRICT_MAX_REQUESTS = 1;
const CURRENT_TIME_MS = 2000;
const WINDOW_START_MS = CURRENT_TIME_MS - RATE_LIMIT_WINDOW_MS;
const HTTP_OK = 200;
const HTTP_TOO_MANY_REQUESTS = 429;

const mockRedis = {
	zAdd: vi.fn(),
	zRemRangeByScore: vi.fn(),
	zCard: vi.fn(),
	expire: vi.fn(),
};

import { createRateLimiter } from "@/core/http/rate-limiter";

const mockLogger = {
	warn: vi.fn(),
	error: vi.fn(),
};

describe("createRateLimiter", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("cleans up all expired request entries before counting", async () => {
		const app = new Hono();

		mockRedis.zCard.mockResolvedValue(REQUEST_COUNT_BELOW_LIMIT);
		mockRedis.zAdd.mockResolvedValue(undefined);
		mockRedis.zRemRangeByScore.mockResolvedValue(0);
		mockRedis.expire.mockResolvedValue(1);

		app.use(
			"*",
			createRateLimiter({
				config: {
					windowMs: RATE_LIMIT_WINDOW_MS,
					maxRequests: MAX_REQUESTS,
				},
				logger: mockLogger,
				store: mockRedis,
			}),
		);
		app.get("/", (c) => c.json({ ok: true }));

		vi.spyOn(Date, "now").mockReturnValue(CURRENT_TIME_MS);

		const response = await app.request("http://localhost/");

		expect(response.status).toBe(HTTP_OK);
		expect(mockRedis.zRemRangeByScore).toHaveBeenCalledWith(
			expect.any(String),
			0,
			WINDOW_START_MS,
		);
	});

	it("returns the shared rate limit error code when the limit is exceeded", async () => {
		const app = new Hono();

		mockRedis.zCard.mockResolvedValue(REQUEST_COUNT_ABOVE_LIMIT);
		mockRedis.zAdd.mockResolvedValue(undefined);
		mockRedis.zRemRangeByScore.mockResolvedValue(0);
		mockRedis.expire.mockResolvedValue(1);

		app.use(
			"*",
			createRateLimiter({
				config: {
					windowMs: RATE_LIMIT_WINDOW_MS,
					maxRequests: STRICT_MAX_REQUESTS,
				},
				logger: mockLogger,
				store: mockRedis,
			}),
		);
		app.get("/", (c) => c.json({ ok: true }));

		vi.spyOn(Date, "now").mockReturnValue(CURRENT_TIME_MS);

		const response = await app.request("http://localhost/");

		expect(response.status).toBe(HTTP_TOO_MANY_REQUESTS);
		await expect(response.json()).resolves.toMatchObject({
			success: false,
			error: {
				code: "RATE_LIMIT_EXCEEDED",
			},
		});
	});

	it("uses unique sorted-set members for requests in the same millisecond", async () => {
		const app = new Hono();

		mockRedis.zCard.mockResolvedValue(REQUEST_COUNT_BELOW_LIMIT);
		mockRedis.zAdd.mockResolvedValue(undefined);
		mockRedis.zRemRangeByScore.mockResolvedValue(0);
		mockRedis.expire.mockResolvedValue(1);

		app.use(
			"*",
			createRateLimiter({
				config: {
					windowMs: RATE_LIMIT_WINDOW_MS,
					maxRequests: MAX_REQUESTS,
				},
				logger: mockLogger,
				store: mockRedis,
			}),
		);
		app.get("/", (c) => c.json({ ok: true }));

		vi.spyOn(Date, "now").mockReturnValue(CURRENT_TIME_MS);

		await app.request("http://localhost/");
		await app.request("http://localhost/");

		expect(mockRedis.zAdd).toHaveBeenCalledTimes(2);

		const firstCall = mockRedis.zAdd.mock.calls[0] as [
			string,
			{
				score: number;
				value: string;
			},
		];
		const secondCall = mockRedis.zAdd.mock.calls[1] as [
			string,
			{
				score: number;
				value: string;
			},
		];

		const [, firstMember] = firstCall;
		const [, secondMember] = secondCall;

		expect(firstMember.score).toBe(CURRENT_TIME_MS);
		expect(secondMember.score).toBe(CURRENT_TIME_MS);
		expect(firstMember.value).toEqual(
			expect.stringContaining(`${CURRENT_TIME_MS}:`),
		);
		expect(secondMember.value).toEqual(
			expect.stringContaining(`${CURRENT_TIME_MS}:`),
		);
		expect(firstMember.value).not.toBe(secondMember.value);
	});
});
