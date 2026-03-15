import { request } from "@/shared/api/http-client";
import type {
	BillingPlan,
	BillingPortalSessionDto,
	BillingStatusDto,
	CheckoutSessionDto,
} from "../types/billing";

export const billingClient = {
	getStatus() {
		return request<BillingStatusDto>("/api/billing/status");
	},
	createCheckoutSession(plan: BillingPlan) {
		return request<CheckoutSessionDto>("/api/billing/checkout-session", {
			method: "POST",
			body: JSON.stringify({ plan }),
		});
	},
	createPortalSession() {
		return request<BillingPortalSessionDto>("/api/billing/portal-session", {
			method: "POST",
		});
	},
};
