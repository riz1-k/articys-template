import path from "node:path";
import { defineConfig } from "vitest/config";

process.env.DATABASE_URL ??=
	"postgres://postgres:postgres@localhost:5432/articys";
process.env.BETTER_AUTH_SECRET ??= "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
process.env.BETTER_AUTH_URL ??= "https://api.example.com";
process.env.CORS_ORIGIN ??= "https://app.example.com";
process.env.STRIPE_SECRET_KEY ??= "sk_test_123";
process.env.STRIPE_WEBHOOK_SECRET ??= "whsec_test_123";
process.env.STRIPE_PRICE_ID_MONTHLY ??= "price_monthly";
process.env.STRIPE_PRICE_ID_YEARLY ??= "price_yearly";
process.env.STRIPE_SUCCESS_URL ??= "https://app.example.com/billing/success";
process.env.STRIPE_CANCEL_URL ??= "https://app.example.com/billing/cancel";

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	test: {
		environment: "node",
		include: ["src/**/*.test.ts"],
		exclude: ["node_modules", "dist"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			include: ["src/**/*.ts"],
			exclude: ["src/**/*.test.ts", "src/index.ts"],
		},
	},
});
