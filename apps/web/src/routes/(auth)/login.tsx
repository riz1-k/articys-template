import { createFileRoute, redirect } from "@tanstack/react-router";
import AuthShell from "@/features/auth/components/auth-shell";
import SignInForm from "@/features/auth/components/sign-in-form";
import {
	authSearchSchema,
	getGuestRouteRedirectPath,
} from "@/features/auth/lib/auth-flow";

export const Route = createFileRoute("/(auth)/login")({
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
			eyebrow="Access workspace"
			title="Sign in without breaking the product flow."
			description="Use the same account boundary that protects the dashboard and the todo workflow."
		>
			<SignInForm callbackURL={callbackURL} />
		</AuthShell>
	);
}
