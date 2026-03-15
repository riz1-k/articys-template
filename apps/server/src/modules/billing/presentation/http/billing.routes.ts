import type { Hono } from "hono";
import { STATUS_CODES } from "@/lib/constants";
import type { BillingUseCases } from "@/modules/billing/application/create-billing-use-cases";
import type { IdentitySessionService } from "@/modules/identity/application/create-identity-session-service";
import { noContent, success } from "@/platform/http/api-response";
import { AppError } from "@/platform/http/app-error";
import { ErrorCodes } from "@/platform/http/error-codes";
import { getCurrentUser, requireAuth } from "@/platform/http/require-auth";
import { validateBody } from "@/platform/http/validation";
import { createCheckoutSessionSchema } from "./billing.schemas";

function getValidatedValue<T>(
	c: { get(key: string): unknown },
	key: string,
): T {
	return c.get(key) as T;
}

export function registerBillingRoutes(
	app: Hono,
	identitySessionService: IdentitySessionService,
	billingUseCases: BillingUseCases,
) {
	app.get(
		"/api/billing/status",
		requireAuth(identitySessionService),
		async (c) => {
			const currentUser = getCurrentUser(c);
			const status = await billingUseCases.getBillingStatus({
				userId: currentUser.id,
			});

			return success(c, status);
		},
	);

	app.post(
		"/api/billing/checkout-session",
		requireAuth(identitySessionService),
		validateBody(createCheckoutSessionSchema),
		async (c) => {
			const currentUser = getCurrentUser(c);
			const body = getValidatedValue<{ plan: "monthly" | "yearly" }>(
				c,
				"validatedBody",
			);
			const session = await billingUseCases.createCheckoutSession({
				userId: currentUser.id,
				email: currentUser.email,
				name: currentUser.name,
				plan: body.plan,
			});

			return success(c, session);
		},
	);

	app.post(
		"/api/billing/portal-session",
		requireAuth(identitySessionService),
		async (c) => {
			const currentUser = getCurrentUser(c);
			const session = await billingUseCases.createBillingPortalSession({
				userId: currentUser.id,
			});

			return success(c, session);
		},
	);

	app.post("/api/billing/webhooks/stripe", async (c) => {
		const signature = c.req.header("stripe-signature");

		if (!signature) {
			throw new AppError(
				STATUS_CODES.BAD_REQUEST,
				"Missing Stripe signature header",
				ErrorCodes.BAD_REQUEST,
			);
		}

		const payload = await c.req.text();
		await billingUseCases.handleStripeWebhook({
			payload,
			signature,
		});

		return noContent(c);
	});
}
