import { createFileRoute } from "@tanstack/react-router";
import AuthShell from "@/features/auth/components/auth-shell";
import ResetPasswordForm from "@/features/auth/components/reset-password-form";
import { authSearchSchema } from "@/features/auth/lib/auth-flow";

export const Route = createFileRoute("/(auth)/reset-password")({
	validateSearch: authSearchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const { callbackURL, token } = Route.useSearch();

	return (
		<AuthShell
			eyebrow="Complete reset"
			title="Set a new password and get back to the product."
			description="This page is the final step from the emailed reset link, with token-aware states for success and invalid links."
		>
			<ResetPasswordForm token={token} callbackURL={callbackURL} />
		</AuthShell>
	);
}
