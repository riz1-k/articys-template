import { createFileRoute, redirect } from "@tanstack/react-router";
import AuthShell from "@/features/auth/components/auth-shell";
import SignUpForm from "@/features/auth/components/sign-up-form";
import {
	authSearchSchema,
	getGuestRouteRedirectPath,
} from "@/features/auth/lib/auth-flow";

export const Route = createFileRoute("/(auth)/register")({
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
			eyebrow="Create account"
			title="Start with a real account, not a throwaway demo screen."
			description="Registration should feel like part of the same application shell, with the same navigation logic after success."
		>
			<SignUpForm callbackURL={callbackURL} />
		</AuthShell>
	);
}
