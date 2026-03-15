import { CreditCard, ExternalLink } from "lucide-react";
import Alert from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getPlanState, isActiveSubscription } from "../hooks/use-billing";
import type { BillingStatusDto } from "../types/billing";

const DEFAULT_FREE_TODO_LIMIT = 5;

interface BillingCardProps {
	status?: BillingStatusDto;
	isLoading: boolean;
	isStartingMonthlyCheckout: boolean;
	isStartingYearlyCheckout: boolean;
	isOpeningPortal: boolean;
	upgradePrompt?: string | null;
	onUpgradeMonthly: () => void;
	onUpgradeYearly: () => void;
	onManageBilling: () => void;
}

function formatSubscriptionStatus(status?: string) {
	if (!status) {
		return "No subscription";
	}

	return status.replaceAll("_", " ");
}

function formatUsage(status?: BillingStatusDto) {
	if (!status) {
		return "Loading...";
	}

	const suffix = status.entitlement.hasActiveSubscription
		? "unlimited"
		: String(status.entitlement.maxTodos ?? DEFAULT_FREE_TODO_LIMIT);

	return `${status.entitlement.currentTodoCount} / ${suffix}`;
}

export function BillingCard({
	status,
	isLoading,
	isStartingMonthlyCheckout,
	isStartingYearlyCheckout,
	isOpeningPortal,
	upgradePrompt,
	onUpgradeMonthly,
	onUpgradeYearly,
	onManageBilling,
}: BillingCardProps) {
	const planState = getPlanState(status);
	const hasPortalAccess = Boolean(status?.customerId);
	const showManageBilling =
		hasPortalAccess && isActiveSubscription(status?.subscription);

	return (
		<Card
			className={cn(
				upgradePrompt
					? "ring-2 ring-amber-500/60 ring-offset-2 ring-offset-background"
					: "",
			)}
		>
			<CardHeader>
				<CardTitle>Billing</CardTitle>
				<CardDescription>
					Track plan access and move into Stripe when you need to upgrade or
					manage a subscription.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-3">
					<div className="border border-border p-4">
						<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
							Plan
						</p>
						<p className="mt-2 font-semibold text-2xl capitalize">
							{planState}
						</p>
					</div>
					<div className="grid gap-3 sm:grid-cols-2">
						<div className="border border-border p-4">
							<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
								Subscription
							</p>
							<p className="mt-2 font-medium text-sm capitalize">
								{isLoading
									? "Loading..."
									: formatSubscriptionStatus(status?.subscription?.status)}
							</p>
						</div>
						<div className="border border-border p-4">
							<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
								Todo usage
							</p>
							<p className="mt-2 font-medium text-sm">{formatUsage(status)}</p>
						</div>
					</div>
					<div className="border border-border p-4">
						<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
							Create access
						</p>
						<p className="mt-2 font-medium text-sm">
							{status
								? status.entitlement.canCreateMoreTodos
									? "You can create more todos"
									: "Creation locked until you upgrade"
								: "Loading..."}
						</p>
					</div>
				</div>

				{upgradePrompt ? <Alert>{upgradePrompt}</Alert> : null}

				{showManageBilling ? (
					<Button
						variant="outline"
						className="w-full justify-between"
						disabled={isOpeningPortal}
						onClick={onManageBilling}
					>
						<span className="flex items-center gap-2">
							<CreditCard />
							Manage billing
						</span>
						<ExternalLink />
					</Button>
				) : (
					<div className="grid gap-2 sm:grid-cols-2">
						<Button
							disabled={isStartingMonthlyCheckout || isStartingYearlyCheckout}
							onClick={onUpgradeMonthly}
						>
							{isStartingMonthlyCheckout ? "Redirecting..." : "Upgrade monthly"}
						</Button>
						<Button
							variant="outline"
							disabled={isStartingMonthlyCheckout || isStartingYearlyCheckout}
							onClick={onUpgradeYearly}
						>
							{isStartingYearlyCheckout ? "Redirecting..." : "Upgrade yearly"}
						</Button>
					</div>
				)}

				{hasPortalAccess && !showManageBilling ? (
					<Button
						variant="ghost"
						className="w-full"
						disabled={isOpeningPortal}
						onClick={onManageBilling}
					>
						{isOpeningPortal
							? "Opening billing portal..."
							: "Manage existing billing"}
					</Button>
				) : null}
			</CardContent>
		</Card>
	);
}
