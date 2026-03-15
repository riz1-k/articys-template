import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	CreditCard,
	LayoutDashboard,
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

const latestUpdates = [
	{
		icon: CreditCard,
		eyebrow: "Latest ship",
		title: "Stripe billing is now wired into the web app",
		description:
			"Checkout, portal access, and billing success or cancel routes now exist in the frontend instead of stopping at server APIs.",
	},
	{
		icon: SquareCheckBig,
		eyebrow: "Entitlements",
		title: "Todo creation now respects subscription limits",
		description:
			"Free accounts can hit a hard cap, get a clear upgrade prompt, and move straight into checkout from the dashboard.",
	},
	{
		icon: LayoutDashboard,
		eyebrow: "UI polish",
		title: "The shell was tightened up for real use",
		description:
			"Recent commits refreshed the auth layout, widened key containers, and made the header behave properly on mobile.",
	},
] as const;

const releaseNotes = [
	"Web billing frontend added on top of the new Stripe server module",
	"Shared billing configuration now comes from app config instead of hardcoded URLs",
	"Todo dashboard upgraded with billing status, usage tracking, and upgrade CTAs",
	"Header, auth shell, and landing layout refined for smaller screens",
] as const;

const buildSurface = [
	{
		label: "Auth",
		value: "Better Auth sessions and protected routes",
	},
	{
		label: "Billing",
		value: "Stripe checkout, portal, and subscription status",
	},
	{
		label: "Workflow",
		value: "A todo feature with API-backed CRUD and limits",
	},
	{
		label: "Architecture",
		value: "Feature-first web app with a DDD-style server module",
	},
] as const;

function HomeComponent() {
	return (
		<div className="bg-background">
			<section className="border-border border-b">
				<div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-16">
					<div className="space-y-6">
						<div className="inline-flex items-center gap-2 border border-border bg-card px-3 py-1.5 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
							<Radar className="size-3.5" />
							Latest updates from `main`
						</div>

						<div className="space-y-4">
							<h1 className="max-w-4xl text-balance font-semibold text-4xl tracking-tight sm:text-5xl lg:text-6xl">
								Auth, billing, and a subscription-aware workflow are already in
								place.
							</h1>
							<p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
								The recent commit history moved Articys past starter-template
								territory. The app now ships Stripe billing flows, todo limits
								tied to plan access, and a tighter web shell around the product.
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

						<div className="grid gap-3 sm:grid-cols-2">
							{releaseNotes.map((note) => (
								<div
									key={note}
									className="border border-border bg-card px-4 py-4 text-muted-foreground text-sm"
								>
									{note}
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
											Current shape
										</p>
										<p className="mt-2 font-medium text-sm">
											Protected product flow with billing-aware entitlements
										</p>
									</div>
									<div className="flex size-11 items-center justify-center border border-border bg-muted">
										<Orbit className="size-5" />
									</div>
								</div>

								<div className="grid gap-3 sm:grid-cols-2">
									{buildSurface.map(({ label, value }) => (
										<div
											key={label}
											className="border border-border bg-background px-4 py-4"
										>
											<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
												{label}
											</p>
											<p className="mt-2 text-muted-foreground text-sm">
												{value}
											</p>
										</div>
									))}
								</div>

								<div className="border border-border bg-linear-to-br from-muted/50 via-card to-background px-4 py-4">
									<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
										What changed recently
									</p>
									<p className="mt-2 text-muted-foreground text-sm">
										The backend gained Stripe-backed billing primitives first,
										then the web app caught up with checkout, billing status,
										and subscription-driven dashboard behavior.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto w-full max-w-7xl px-4 py-10 lg:py-14">
				<div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
					<div>
						<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
							Recent work
						</p>
						<h2 className="mt-2 font-semibold text-2xl tracking-tight sm:text-3xl">
							The landing page now reflects the latest commits instead of a
							generic starter pitch.
						</h2>
					</div>
					<p className="max-w-xl text-muted-foreground text-sm">
						These sections map directly to the newest changes on `main`.
					</p>
				</div>

				<div className="grid gap-4 lg:grid-cols-3">
					{latestUpdates.map(({ icon: Icon, eyebrow, title, description }) => (
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
				<div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[0.85fr_1.15fr] lg:py-14">
					<div className="space-y-3">
						<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
							Flow
						</p>
						<h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
							The app path is now auth to dashboard to billing-aware feature
							usage.
						</h2>
					</div>

					<div className="grid gap-4 md:grid-cols-4">
						{[
							[
								"01",
								"Authenticate",
								"Sign up or sign in through Better Auth and land inside the protected shell.",
							],
							[
								"02",
								"Work in todos",
								"Use the dashboard against the real API instead of a placeholder page.",
							],
							[
								"03",
								"Hit the free limit",
								"The UI surfaces entitlement state and blocks extra creation when needed.",
							],
							[
								"04",
								"Upgrade in Stripe",
								"Move into checkout or the customer portal without leaving the product path.",
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

			<section className="mx-auto w-full max-w-7xl px-4 py-10 lg:py-14">
				<div className="border border-border bg-card px-5 py-6 sm:px-8 sm:py-8">
					<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
						<div>
							<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
								Ready to extend
							</p>
							<h2 className="mt-2 font-semibold text-2xl tracking-tight sm:text-3xl">
								Start from a product slice that already has real constraints.
							</h2>
							<p className="mt-3 max-w-2xl text-muted-foreground text-sm leading-6">
								Articys now gives you authenticated routing, a server-backed
								todo feature, Stripe billing, and entitlement checks as a
								baseline for the next module.
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
