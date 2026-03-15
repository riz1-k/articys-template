import { createFileRoute, redirect } from "@tanstack/react-router";
import { getUser } from "@/features/auth/server/get-user";
import TodoDashboard from "@/features/todos/components/todo-dashboard";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await getUser();
		return { session };
	},
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
