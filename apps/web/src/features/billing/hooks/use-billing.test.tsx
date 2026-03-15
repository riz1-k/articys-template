import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { billingClient } from "@/features/billing/api/billing-api";
import { redirectToExternalUrl } from "@/features/billing/lib/browser";
import { useBillingActions } from "./use-billing";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("@/features/billing/api/billing-api", () => ({
	billingClient: {
		getStatus: vi.fn(),
		createCheckoutSession: vi.fn(),
		createPortalSession: vi.fn(),
	},
}));

vi.mock("@/features/billing/lib/browser", () => ({
	redirectToExternalUrl: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: {
		error: vi.fn(),
	},
}));

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
			mutations: {
				retry: false,
			},
		},
	});

	return function Wrapper({ children }: { children: ReactNode }) {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	};
}

describe("useBillingActions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("creates a checkout session and redirects to Stripe", async () => {
		vi.mocked(billingClient.createCheckoutSession).mockResolvedValue({
			sessionId: "cs_test_123",
			url: "https://checkout.stripe.com/c/pay/cs_test_123",
		});

		const { result } = renderHook(() => useBillingActions(), {
			wrapper: createWrapper(),
		});

		await act(async () => {
			await result.current.startCheckout("monthly");
		});

		expect(billingClient.createCheckoutSession).toHaveBeenCalledWith("monthly");
		expect(redirectToExternalUrl).toHaveBeenCalledWith(
			"https://checkout.stripe.com/c/pay/cs_test_123",
		);
	});

	it("opens the billing portal and redirects to Stripe", async () => {
		vi.mocked(billingClient.createPortalSession).mockResolvedValue({
			url: "https://billing.stripe.com/session/test",
		});

		const { result } = renderHook(() => useBillingActions(), {
			wrapper: createWrapper(),
		});

		await act(async () => {
			await result.current.openPortal();
		});

		expect(billingClient.createPortalSession).toHaveBeenCalledOnce();
		expect(redirectToExternalUrl).toHaveBeenCalledWith(
			"https://billing.stripe.com/session/test",
		);
	});

	it("surfaces checkout errors through the existing toast pattern", async () => {
		vi.mocked(billingClient.createCheckoutSession).mockRejectedValue(
			new Error("Stripe is unavailable"),
		);

		const { result } = renderHook(() => useBillingActions(), {
			wrapper: createWrapper(),
		});

		await expect(
			act(async () => {
				await result.current.startCheckout("yearly");
			}),
		).rejects.toThrow("Stripe is unavailable");

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith("Stripe is unavailable");
		});
	});
});
