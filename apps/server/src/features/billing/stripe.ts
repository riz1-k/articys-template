import Stripe from "stripe";
import { AppError } from "@/core/http/app-error";
import { ErrorCodes } from "@/core/http/error-codes";
import type {
	BillingGatewayPort,
	BillingWebhookEvent,
	CreateStripeCheckoutSessionInput,
	CreateStripeCustomerInput,
	StripeSubscriptionSnapshot,
} from "@/features/billing/billing-gateway.port";
import type {
	BillingPlan,
	BillingSubscriptionStatus,
} from "@/features/billing/subscription";
import { MS_IN_SECOND, STATUS_CODES } from "@/lib/constants";

export function createStripeGateway({
	secretKey,
	webhookSecret,
	priceIds,
}: {
	secretKey: string;
	webhookSecret: string;
	priceIds: Record<BillingPlan, string>;
}): BillingGatewayPort {
	const stripe = new Stripe(secretKey);

	return {
		async createCustomer(input: CreateStripeCustomerInput) {
			const customer = await stripe.customers.create({
				email: input.email,
				name: input.name,
				metadata: {
					userId: input.userId,
				},
			});

			return { id: customer.id };
		},

		async createCheckoutSession(input: CreateStripeCheckoutSessionInput) {
			const session = await stripe.checkout.sessions.create({
				mode: "subscription",
				customer: input.customerId,
				success_url: input.successUrl,
				cancel_url: input.cancelUrl,
				line_items: [
					{
						price: priceIds[input.plan],
						quantity: 1,
					},
				],
				allow_promotion_codes: true,
			});

			if (!session.url) {
				throw new AppError(
					STATUS_CODES.INTERNAL_SERVER_ERROR,
					"Stripe checkout did not return a redirect URL",
					ErrorCodes.INTERNAL_ERROR,
				);
			}

			return {
				id: session.id,
				url: session.url,
			};
		},

		async createBillingPortalSession({ customerId, returnUrl }) {
			const session = await stripe.billingPortal.sessions.create({
				customer: customerId,
				return_url: returnUrl,
			});

			return { url: session.url };
		},

		verifyAndParseWebhook({ payload, signature }) {
			try {
				const event = stripe.webhooks.constructEvent(
					payload,
					signature,
					webhookSecret,
				);

				return mapStripeEvent(event);
			} catch (error) {
				throw new AppError(
					STATUS_CODES.BAD_REQUEST,
					"Invalid Stripe webhook signature",
					ErrorCodes.BAD_REQUEST,
					error instanceof Error ? error.message : undefined,
				);
			}
		},

		getPlanForPriceId(priceId) {
			if (priceId === priceIds.monthly) {
				return "monthly";
			}

			if (priceId === priceIds.yearly) {
				return "yearly";
			}

			return null;
		},
	};
}

function mapStripeEvent(event: Stripe.Event): BillingWebhookEvent {
	switch (event.type) {
		case "checkout.session.completed": {
			const session = event.data.object as Stripe.Checkout.Session;

			return {
				type: event.type,
				customerId: toStringOrNull(session.customer),
				subscriptionId: toStringOrNull(session.subscription),
			};
		}
		case "customer.subscription.created":
		case "customer.subscription.updated":
		case "customer.subscription.deleted": {
			const subscription = event.data.object as Stripe.Subscription;

			return {
				type: event.type,
				...mapStripeSubscription(subscription),
			};
		}
		default:
			throw new AppError(
				STATUS_CODES.BAD_REQUEST,
				`Unhandled Stripe event type: ${event.type}`,
				ErrorCodes.BAD_REQUEST,
			);
	}
}

function mapStripeSubscription(
	subscription: Stripe.Subscription,
): StripeSubscriptionSnapshot {
	const primaryItem = subscription.items.data[0];

	return {
		customerId: toStringOrThrow(subscription.customer),
		subscriptionId: subscription.id,
		status: mapStripeStatus(subscription.status),
		priceId: primaryItem?.price?.id ?? primaryItem?.plan?.id ?? null,
		cancelAtPeriodEnd: subscription.cancel_at_period_end,
		currentPeriodEnd: primaryItem?.current_period_end
			? new Date(primaryItem.current_period_end * MS_IN_SECOND)
			: null,
	};
}

function mapStripeStatus(
	status: Stripe.Subscription.Status,
): BillingSubscriptionStatus {
	switch (status) {
		case "trialing":
			return "trialing";
		case "active":
			return "active";
		case "past_due":
			return "past_due";
		case "canceled":
			return "canceled";
		case "unpaid":
			return "unpaid";
		case "incomplete":
		case "incomplete_expired":
			return "incomplete";
		case "paused":
			return "inactive";
	}
}

function toStringOrNull(
	value:
		| string
		| Stripe.DeletedCustomer
		| Stripe.Customer
		| Stripe.Subscription
		| null,
): string | null {
	if (!value) {
		return null;
	}

	return typeof value === "string" ? value : value.id;
}

function toStringOrThrow(
	value: string | Stripe.DeletedCustomer | Stripe.Customer,
) {
	const stringValue = toStringOrNull(value);

	if (!stringValue) {
		throw new AppError(
			STATUS_CODES.BAD_REQUEST,
			"Stripe webhook is missing a customer identifier",
			ErrorCodes.BAD_REQUEST,
		);
	}

	return stringValue;
}
