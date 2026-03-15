import { Link } from "@tanstack/react-router";
import { LayoutGrid, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { authClient } from "@/features/auth/lib/auth-client";
import { cn } from "@/lib/utils";
import UserMenu from "./user-menu";

interface HeaderProps {
	session: Awaited<ReturnType<typeof authClient.getSession>> | null;
}

export default function Header({ session }: HeaderProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const links = [
		{ to: "/", label: "Home" },
		{ to: "/dashboard", label: "Dashboard" },
	] as const;

	return (
		<header className="border-border border-b bg-background">
			<div className="mx-auto w-full max-w-6xl px-4 py-3">
				<div className="flex items-center justify-between gap-3">
					<Link
						to="/"
						className="flex shrink-0 items-center gap-3 text-foreground"
						onClick={() => setIsMenuOpen(false)}
					>
						<div className="flex size-9 items-center justify-center border border-border bg-card text-foreground">
							<LayoutGrid className="size-4" />
						</div>
						<div>
							<p className="font-semibold text-sm tracking-tight">Articys</p>
							<p className="text-[11px] text-muted-foreground">Web workspace</p>
						</div>
					</Link>

					<div className="hidden items-center gap-6 sm:flex">
						<nav className="flex flex-wrap items-center gap-1.5">
							{links.map(({ to, label }) => {
								return (
									<Link
										key={to}
										to={to}
										activeProps={{
											className: "bg-foreground text-background",
										}}
										inactiveProps={{
											className:
												"text-muted-foreground hover:bg-muted hover:text-foreground",
										}}
										className="px-3 py-2 font-medium text-xs uppercase tracking-[0.18em] transition-colors"
									>
										{label}
									</Link>
								);
							})}
						</nav>
					</div>

					<div className="hidden items-center justify-end sm:flex">
						<UserMenu session={session} />
					</div>

					<Button
						type="button"
						variant="outline"
						size="icon"
						className="sm:hidden"
						aria-label={
							isMenuOpen ? "Close navigation menu" : "Open navigation menu"
						}
						onClick={() => setIsMenuOpen((current) => !current)}
					>
						{isMenuOpen ? (
							<X className="size-4" />
						) : (
							<Menu className="size-4" />
						)}
					</Button>
				</div>

				<div
					className={cn(
						"grid overflow-hidden transition-[grid-template-rows,margin-top] duration-200 sm:hidden",
						isMenuOpen ? "mt-3 grid-rows-[1fr]" : "grid-rows-[0fr]",
					)}
				>
					<div className="min-h-0">
						<div className="border border-border bg-card">
							<nav className="grid border-border border-b">
								{links.map(({ to, label }) => {
									return (
										<Link
											key={to}
											to={to}
											onClick={() => setIsMenuOpen(false)}
											activeProps={{
												className:
													"bg-foreground text-background border-border border-b",
											}}
											inactiveProps={{
												className:
													"text-muted-foreground hover:bg-muted hover:text-foreground border-border border-b last:border-b-0",
											}}
											className="px-4 py-3 font-medium text-xs uppercase tracking-[0.18em] transition-colors"
										>
											{label}
										</Link>
									);
								})}
							</nav>

							<div className="px-4 py-4">
								<UserMenu session={session} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
