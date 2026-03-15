import { Link } from "@tanstack/react-router";
import { LayoutGrid } from "lucide-react";
import type { authClient } from "@/features/auth/lib/auth-client";
import UserMenu from "./user-menu";

interface HeaderProps {
	session: Awaited<ReturnType<typeof authClient.getSession>> | null;
}

export default function Header({ session }: HeaderProps) {
	const links = [
		{ to: "/", label: "Home" },
		{ to: "/dashboard", label: "Dashboard" },
	] as const;

	return (
		<header className="border-border border-b bg-background">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex min-w-0 items-center gap-6">
					<Link
						to="/"
						className="flex shrink-0 items-center gap-3 text-foreground"
					>
						<div className="flex size-9 items-center justify-center border border-border bg-card text-foreground">
							<LayoutGrid className="size-4" />
						</div>
						<div>
							<p className="font-semibold text-sm tracking-tight">Articys</p>
							<p className="text-[11px] text-muted-foreground">Web workspace</p>
						</div>
					</Link>

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

				<div className="flex items-center justify-end">
					<UserMenu session={session} />
				</div>
			</div>
		</header>
	);
}
