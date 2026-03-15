import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, LogOut, User } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/features/auth/lib/auth-client";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function UserMenu() {
	const navigate = useNavigate();
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return <Skeleton className="h-8 w-28 rounded-none" />;
	}

	if (!session) {
		return (
			<Link to="/login">
				<Button variant="outline" className="uppercase tracking-[0.18em]">
					Sign In
				</Button>
			</Link>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={<Button variant="outline" className="min-w-0 gap-2 px-2" />}
			>
				<User className="size-4" />
				<span className="max-w-32 truncate">{session.user.name}</span>
				<span className="text-muted-foreground">
					<ChevronDown className="size-4" />
				</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-56 bg-card">
				<DropdownMenuGroup>
					<DropdownMenuLabel className="px-3 py-2.5">
						<p className="truncate font-medium text-foreground text-xs">
							{session.user.name}
						</p>
						<p className="truncate text-[11px] text-muted-foreground">
							{session.user.email}
						</p>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						onClick={() => {
							authClient.signOut({
								fetchOptions: {
									onSuccess: () => {
										navigate({
											to: "/",
										});
									},
								},
							});
						}}
					>
						<LogOut className="size-4" />
						Sign Out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
