import { createFileRoute } from "@tanstack/react-router";
import AuthShell from "@/features/auth/components/auth-shell";
import VerifyEmailPanel from "@/features/auth/components/verify-email-panel";
import { authSearchSchema } from "@/features/auth/lib/auth-flow";

export const Route = createFileRoute("/(auth)/verify-email")({
	validateSearch: authSearchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const { callbackURL, token } = Route.useSearch();

	return (
		<AuthShell
			eyebrow="Confirm address"
			title="Verify the email, then continue where the app expects."
			description="The verification link comes from Better Auth, but the landing experience stays aligned with the rest of the frontend."
		>
			<VerifyEmailPanel token={token} callbackURL={callbackURL} />
		</AuthShell>
	);
}
