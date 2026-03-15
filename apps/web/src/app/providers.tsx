import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

interface AppProvidersProps {
	children: ReactNode;
	queryClient: QueryClient;
}

export function AppProviders({ children, queryClient }: AppProvidersProps) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
