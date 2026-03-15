import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface TodoDashboardSidebarProps {
	total: number;
	completed: number;
}

export function TodoDashboardSidebar({
	total,
	completed,
}: TodoDashboardSidebarProps) {
	return (
		<aside className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Progress</CardTitle>
					<CardDescription>
						A quick snapshot of your authenticated task state.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-3">
					<div className="border border-border p-4">
						<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
							Total
						</p>
						<p className="mt-2 font-semibold text-3xl">{total}</p>
					</div>
					<div className="border border-border p-4">
						<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
							Completed
						</p>
						<p className="mt-2 font-semibold text-3xl">{completed}</p>
					</div>
					<div className="border border-border p-4">
						<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
							Open
						</p>
						<p className="mt-2 font-semibold text-3xl">
							{Math.max(0, total - completed)}
						</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Architecture Notes</CardTitle>
					<CardDescription>
						This page now uses feature-local APIs and hooks instead of a
						component-global fetch layer.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3 text-muted-foreground">
					<p>- auth session comes from Better Auth cookies</p>
					<p>- todo server state is managed with TanStack Query</p>
					<p>- route files stay thin and compose feature components</p>
				</CardContent>
			</Card>
		</aside>
	);
}
