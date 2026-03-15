import { beforeEach, describe, expect, it, vi } from "vitest";

const { loggerInfo, pingDatabase, pingCache, isCacheConfigured } = vi.hoisted(
	() => ({
		loggerInfo: vi.fn(),
		pingDatabase: vi.fn(),
		pingCache: vi.fn(),
		isCacheConfigured: vi.fn(),
	}),
);

vi.mock("@/platform/observability/logger", () => ({
	logger: {
		info: loggerInfo,
	},
}));

vi.mock("@/infrastructure/database", () => ({
	pingDatabase,
}));

vi.mock("@/infrastructure/cache", () => ({
	pingCache,
	isCacheConfigured,
}));

vi.mock("@/platform/config/app.config", () => ({
	appConfig: {
		env: "production",
		isDevelopment: false,
		logging: {
			level: "info",
		},
		rateLimit: {
			windowMs: 60000,
			maxRequests: 100,
		},
		cors: {
			origin: "http://localhost:3001",
		},
	},
}));

import { logStartup } from "./startup-logger";

describe("logStartup", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		pingDatabase.mockResolvedValue(true);
	});

	it("reports cache errors when Redis is configured but unavailable", async () => {
		isCacheConfigured.mockReturnValue(true);
		pingCache.mockResolvedValue(false);

		await logStartup({
			url: "http://localhost:3000",
			port: 3000,
			hostname: "0.0.0.0",
		} as never);

		expect(loggerInfo).toHaveBeenCalledWith(
			expect.objectContaining({
				cache: "error",
				database: "ok",
			}),
			expect.stringContaining("Cache OFF"),
		);
	});

	it("reports cache as disabled when Redis is not configured", async () => {
		isCacheConfigured.mockReturnValue(false);
		pingCache.mockResolvedValue(false);

		await logStartup({
			url: "http://localhost:3000",
			port: 3000,
			hostname: "0.0.0.0",
		} as never);

		expect(loggerInfo).toHaveBeenCalledWith(
			expect.objectContaining({
				cache: "disabled",
				database: "ok",
			}),
			expect.stringContaining("Cache OFF"),
		);
		expect(pingCache).not.toHaveBeenCalled();
	});
});
