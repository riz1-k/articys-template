import { createFileRoute, redirect } from "@tanstack/react-router";
import TodoDashboard from "@/features/todos/components/todo-dashboard";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	loader: async ({ context }) => {
		if (!context.session) {
			throw redirect({
				to: "/login",
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
