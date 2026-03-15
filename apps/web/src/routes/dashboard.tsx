import { createFileRoute, redirect } from "@tanstack/react-router";
import { getProtectedRouteLoginPath } from "@/features/auth/lib/auth-flow";
import TodoDashboard from "@/features/todos/components/todo-dashboard";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	loader: async ({ context }) => {
		if (!context.session) {
			throw redirect({
				to: getProtectedRouteLoginPath("/dashboard"),
			});
		}
	},
});

function RouteComponent() {
	const { session } = Route.useRouteContext();

	return (
		<TodoDashboard
			userName={session?.user.name ?? "Friend"}
			userEmail={session?.user.email ?? "unknown"}
		/>
	);
}
