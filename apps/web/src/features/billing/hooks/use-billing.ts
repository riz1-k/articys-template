import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { billingClient } from "@/features/billing/api/billing-api";
import { redirectToExternalUrl } from "@/features/billing/lib/browser";
import type {
	BillingPlan,
	BillingStatusDto,
} from "@/features/billing/types/billing";

export const BILLING_STATUS_QUERY_KEY = ["billing", "status"] as const;

export function isActiveSubscription(status: BillingStatusDto["subscription"]) {
	return status?.status === "active" || status?.status === "trialing";
}

export function getPlanState(status: BillingStatusDto | undefined) {
	if (status && isActiveSubscription(status.subscription)) {
		return status.subscription?.plan ?? "free";
	}

	return "free";
}

export function useBillingStatusQuery() {
	return useQuery({
		queryKey: BILLING_STATUS_QUERY_KEY,
		queryFn: () => billingClient.getStatus(),
	});
}

export function useBillingActions() {
	const queryClient = useQueryClient();

	const checkoutMutation = useMutation({
		mutationFn: (plan: BillingPlan) =>
			billingClient.createCheckoutSession(plan),
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to start checkout session",
			);
		},
	});

	const portalMutation = useMutation({
		mutationFn: () => billingClient.createPortalSession(),
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to open billing portal",
			);
		},
	});

	async function startCheckout(plan: BillingPlan) {
		const session = await checkoutMutation.mutateAsync(plan);
		redirectToExternalUrl(session.url);
	}

	async function openPortal() {
		const session = await portalMutation.mutateAsync();
		redirectToExternalUrl(session.url);
	}

	async function refreshBillingStatus() {
		await queryClient.invalidateQueries({
			queryKey: BILLING_STATUS_QUERY_KEY,
		});
		await queryClient.fetchQuery({
			queryKey: BILLING_STATUS_QUERY_KEY,
			queryFn: () => billingClient.getStatus(),
		});
	}

	return {
		checkoutMutation,
		portalMutation,
		startCheckout,
		openPortal,
		refreshBillingStatus,
	};
}
