import { createFileRoute, redirect } from "@tanstack/react-router";
import { getProtectedRouteLoginPath } from "@/features/auth/lib/auth-flow";
import { BillingResultPage } from "@/features/billing/components/billing-result-page";

export const Route = createFileRoute("/billing/cancel")({
	component: RouteComponent,
	loader: async ({ context }) => {
		if (!context.session) {
			throw redirect({
				to: getProtectedRouteLoginPath("/billing/cancel"),
			});
		}
	},
});

function RouteComponent() {
	return (
		<BillingResultPage
			eyebrow="Checkout canceled"
			title="No changes were made"
			description="Your subscription was not changed. You can return to the dashboard and try again whenever you’re ready."
		/>
	);
}
