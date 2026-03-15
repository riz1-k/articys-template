import { createFileRoute, redirect } from "@tanstack/react-router";
import AuthShell from "@/features/auth/components/auth-shell";
import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";
import {
	authSearchSchema,
	getGuestRouteRedirectPath,
} from "@/features/auth/lib/auth-flow";

export const Route = createFileRoute("/(auth)/forgot-password")({
	validateSearch: authSearchSchema,
	beforeLoad: ({ context, search }) => {
		const redirectPath = getGuestRouteRedirectPath(
			Boolean(context.session),
			search.callbackURL,
		);

		if (redirectPath) {
			throw redirect({
				to: redirectPath,
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { callbackURL } = Route.useSearch();

	return (
		<AuthShell
			eyebrow="Recover access"
			title="Reset access without leaking account state."
			description="The reset request stays privacy-safe while still preserving where the user should land after they finish the auth flow."
		>
			<ForgotPasswordForm callbackURL={callbackURL} />
		</AuthShell>
	);
}
