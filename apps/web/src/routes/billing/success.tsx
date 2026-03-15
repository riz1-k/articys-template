import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { getProtectedRouteLoginPath } from "@/features/auth/lib/auth-flow";
import { billingClient } from "@/features/billing/api/billing-api";
import { BillingResultPage } from "@/features/billing/components/billing-result-page";
import { BILLING_STATUS_QUERY_KEY } from "@/features/billing/hooks/use-billing";

export const Route = createFileRoute("/billing/success")({
	component: RouteComponent,
	loader: async ({ context }) => {
		if (!context.session) {
			throw redirect({
				to: getProtectedRouteLoginPath("/billing/success"),
			});
		}
	},
});

function RouteComponent() {
	const queryClient = useQueryClient();

	useEffect(() => {
		void queryClient.invalidateQueries({
			queryKey: BILLING_STATUS_QUERY_KEY,
		});
		void queryClient.fetchQuery({
			queryKey: BILLING_STATUS_QUERY_KEY,
			queryFn: () => billingClient.getStatus(),
		});
	}, [queryClient]);

	return (
		<BillingResultPage
			eyebrow="Billing updated"
			title="Subscription confirmed"
			description="Your checkout completed successfully. Billing access and todo limits will refresh on the dashboard."
		/>
	);
}
