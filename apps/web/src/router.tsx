import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { AppProviders } from "@/app/providers";
import type { RouterAppContext } from "@/routes/__root";
import Loader from "./components/loader";
import "./index.css";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
	const queryClient = new QueryClient();
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		context: {
			session: null,
		} satisfies RouterAppContext,
		defaultPendingComponent: () => <Loader />,
		defaultNotFoundComponent: () => <div>Not Found</div>,
		Wrap: ({ children }) => (
			<AppProviders queryClient={queryClient}>{children}</AppProviders>
		),
	});
	return router;
};

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
