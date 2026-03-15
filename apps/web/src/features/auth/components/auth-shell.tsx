import { Link } from "@tanstack/react-router";
import { ArrowRight, LayoutGrid, Radar } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthShellProps {
	eyebrow: string;
	title: string;
	description: string;
	children: ReactNode;
	asideTitle?: string;
	asideDescription?: string;
}

const authHighlights = [
	"Cookie-based sessions already wired to the server boundary.",
	"Email verification and password reset run through Better Auth.",
	"Protected dashboard flow stays consistent after auth success.",
] as const;

export default function AuthShell({
	eyebrow,
	title,
	description,
	children,
	asideTitle = "Product starter, not a blank auth demo",
	asideDescription = "The auth screens should feel like the same product as the homepage and dashboard, not a disconnected modal dropped into the app.",
}: AuthShellProps) {
	return (
		<main className="min-h-full bg-background">
			<section className="border-border border-b">
				<div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch lg:py-12">
					<div className="flex flex-col justify-between border border-border bg-card">
						<div className="space-y-6 p-6 sm:p-8">
							<div className="inline-flex items-center gap-2 border border-border bg-background px-3 py-1.5 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
								<Radar className="size-3.5" />
								{eyebrow}
							</div>

							<div className="space-y-4">
								<h1 className="max-w-xl text-balance font-semibold text-4xl tracking-tight sm:text-5xl">
									{title}
								</h1>
								<p className="max-w-lg text-muted-foreground text-sm leading-6 sm:text-base">
									{description}
								</p>
							</div>

							<div className="grid gap-3 sm:grid-cols-3">
								{authHighlights.map((highlight) => (
									<div
										key={highlight}
										className="border border-border bg-background px-4 py-4 text-muted-foreground text-sm leading-6"
									>
										{highlight}
									</div>
								))}
							</div>
						</div>

						<div className="border-border border-t bg-linear-to-r from-muted/40 via-card to-background px-6 py-5 sm:px-8">
							<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
								{asideTitle}
							</p>
							<p className="mt-3 max-w-xl text-muted-foreground text-sm leading-6">
								{asideDescription}
							</p>

							<div className="mt-5 flex flex-col gap-3 sm:flex-row">
								<Link to="/">
									<Button variant="outline" className="w-full sm:w-auto">
										Back to Home
									</Button>
								</Link>
								<Link to="/dashboard">
									<Button className="w-full sm:w-auto">
										Open Dashboard
										<ArrowRight />
									</Button>
								</Link>
							</div>
						</div>
					</div>

					<div className="relative border border-border bg-card">
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_40%)]" />
						<div className="relative flex min-h-full items-center justify-center p-4 sm:p-8">
							<div className="w-full max-w-md border border-border bg-background">
								<div className="border-border border-b px-5 py-4">
									<div className="flex items-center gap-3 text-foreground">
										<div className="flex size-10 items-center justify-center border border-border bg-card">
											<LayoutGrid className="size-4" />
										</div>
										<div>
											<p className="font-semibold text-sm tracking-tight">
												Articys
											</p>
											<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.24em]">
												Identity flow
											</p>
										</div>
									</div>
								</div>
								<div className={cn("p-5 sm:p-6")}>{children}</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
