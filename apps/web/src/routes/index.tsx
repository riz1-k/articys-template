import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	LockKeyhole,
	Orbit,
	Radar,
	SquareCheckBig,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

const featureCards = [
	{
		icon: LockKeyhole,
		eyebrow: "Identity",
		title: "Cookie-based auth that stays out of the way",
		description:
			"Better Auth handles the session boundary while the UI stays focused on product flow.",
	},
	{
		icon: SquareCheckBig,
		eyebrow: "Todos",
		title: "Feature-local state instead of component sprawl",
		description:
			"Todo queries and mutations live inside the todo feature, not in page-level effects.",
	},
	{
		icon: Orbit,
		eyebrow: "Architecture",
		title: "Server and web are aligned without being identical",
		description:
			"DDD on the server, feature-first slices on the web, with clear seams between them.",
	},
] as const;

const valuePoints = [
	"Protected dashboard wired to the new server session service",
	"React Query for server state instead of manual fetch orchestration",
	"TanStack Router routes that stay thin and compositional",
] as const;

function HomeComponent() {
	return (
		<div className="bg-background">
			<section className="border-border border-b">
				<div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-16">
					<div className="space-y-6">
						<div className="inline-flex items-center gap-2 border border-border bg-card px-3 py-1.5 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
							<Radar className="size-3.5" />
							Feature-first app shell
						</div>

						<div className="space-y-4">
							<h1 className="max-w-3xl text-balance font-semibold text-4xl tracking-tight sm:text-5xl lg:text-6xl">
								An authenticated product starter with a real application shape.
							</h1>
							<p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
								Articys is a pragmatic template for teams that want auth,
								routing, server-backed features, and a clean architecture before
								the project turns messy.
							</p>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row">
							<Link to="/dashboard">
								<Button size="lg" className="w-full sm:w-auto">
									Open Dashboard
									<ArrowRight />
								</Button>
							</Link>
							<Link to="/register">
								<Button
									variant="outline"
									size="lg"
									className="w-full sm:w-auto"
								>
									Create Account
								</Button>
							</Link>
						</div>

						<div className="grid gap-3 sm:grid-cols-3">
							{valuePoints.map((point) => (
								<div
									key={point}
									className="border border-border bg-card px-4 py-4 text-muted-foreground text-sm"
								>
									{point}
								</div>
							))}
						</div>
					</div>

					<div className="relative">
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_40%)]" />
						<div className="relative border border-border bg-card p-5">
							<div className="grid gap-4">
								<div className="flex items-center justify-between border border-border bg-background px-4 py-3">
									<div>
										<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
											Current stack
										</p>
										<p className="mt-2 font-medium text-sm">
											TanStack Router, React Query, Better Auth, Hono
										</p>
									</div>
									<div className="flex size-11 items-center justify-center border border-border bg-muted">
										<Orbit className="size-5" />
									</div>
								</div>

								<div className="grid gap-3 sm:grid-cols-2">
									<div className="border border-border bg-background px-4 py-4">
										<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
											Web
										</p>
										<p className="mt-2 text-muted-foreground text-sm">
											Feature modules, shared HTTP client, thin routes.
										</p>
									</div>
									<div className="border border-border bg-background px-4 py-4">
										<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
											Server
										</p>
										<p className="mt-2 text-muted-foreground text-sm">
											Use cases, ports, adapters, and explicit composition.
										</p>
									</div>
								</div>

								<div className="border border-border bg-linear-to-br from-muted/50 via-card to-background px-4 py-4">
									<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
										Why this exists
									</p>
									<p className="mt-2 text-muted-foreground text-sm">
										Most starters stop at auth screens and a blank dashboard.
										This one gives you a working seam between UI features and a
										real backend module.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto w-full max-w-6xl px-4 py-10 lg:py-14">
				<div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
					<div>
						<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
							What you get
						</p>
						<h2 className="mt-2 font-semibold text-2xl tracking-tight sm:text-3xl">
							A starting point that already behaves like an application.
						</h2>
					</div>
					<p className="max-w-xl text-muted-foreground text-sm">
						The homepage now frames the product clearly instead of acting like a
						dev scratchpad.
					</p>
				</div>

				<div className="grid gap-4 lg:grid-cols-3">
					{featureCards.map(({ icon: Icon, eyebrow, title, description }) => (
						<Card key={title} className="rounded-none">
							<CardHeader className="space-y-4">
								<div className="flex size-11 items-center justify-center border border-border bg-muted">
									<Icon className="size-5" />
								</div>
								<div>
									<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
										{eyebrow}
									</p>
									<CardTitle className="mt-2 text-xl leading-tight">
										{title}
									</CardTitle>
								</div>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-muted-foreground text-sm leading-6">
									{description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<section className="border-border border-y bg-card/40">
				<div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[0.8fr_1.2fr] lg:py-14">
					<div className="space-y-3">
						<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
							Flow
						</p>
						<h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
							Start with auth, land in a real workflow, extend by feature.
						</h2>
					</div>

					<div className="grid gap-4 md:grid-cols-3">
						{[
							[
								"01",
								"Authenticate",
								"Create an account or sign in through Better Auth.",
							],
							[
								"02",
								"Enter dashboard",
								"Hit a protected route backed by the server session boundary.",
							],
							[
								"03",
								"Ship features",
								"Add new vertical slices without turning routes into god files.",
							],
						].map(([step, title, description]) => (
							<div
								key={step}
								className="border border-border bg-background px-4 py-5"
							>
								<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
									{step}
								</p>
								<h3 className="mt-3 font-medium text-base">{title}</h3>
								<p className="mt-2 text-muted-foreground text-sm leading-6">
									{description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="mx-auto w-full max-w-6xl px-4 py-10 lg:py-14">
				<div className="border border-border bg-card px-5 py-6 sm:px-8 sm:py-8">
					<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
						<div>
							<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
								Ready to use
							</p>
							<h2 className="mt-2 font-semibold text-2xl tracking-tight sm:text-3xl">
								Use the dashboard as the first real feature, not a placeholder.
							</h2>
							<p className="mt-3 max-w-2xl text-muted-foreground text-sm leading-6">
								The application already has authenticated routing, a protected
								todo flow, and a server module behind it. Extend from there.
							</p>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row">
							<Link to="/dashboard">
								<Button size="lg" className="w-full sm:w-auto">
									Go to Dashboard
								</Button>
							</Link>
							<Link to="/register">
								<Button
									variant="outline"
									size="lg"
									className="w-full sm:w-auto"
								>
									Create Account
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
