import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TodoDashboardHeroProps {
	userName: string;
	isRefreshing: boolean;
	onRefresh: () => void;
}

export function TodoDashboardHero({
	userName,
	isRefreshing,
	onRefresh,
}: TodoDashboardHeroProps) {
	return (
		<div className="border border-border bg-linear-to-r from-amber-50 via-background to-sky-50 p-6 text-foreground dark:from-zinc-900 dark:via-background dark:to-zinc-950">
			<p className="mb-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.35em]">
				Authenticated Workspace
			</p>
			<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<h1 className="font-semibold text-3xl tracking-tight">
						{userName}&apos;s todo board
					</h1>
					<p className="mt-2 max-w-2xl text-muted-foreground text-sm">
						This dashboard is backed by the authenticated todo API, with
						feature-local hooks handling query state and mutations.
					</p>
				</div>
				<Button variant="outline" onClick={onRefresh} disabled={isRefreshing}>
					<RefreshCw />
					Refresh
				</Button>
			</div>
		</div>
	);
}
