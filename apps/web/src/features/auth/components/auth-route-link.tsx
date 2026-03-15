import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

type AuthRoutePath = "/login" | "/register" | "/forgot-password";

interface AuthRouteLinkProps {
	to: AuthRoutePath;
	label: string;
	callbackURL?: string;
	className?: string;
}

export default function AuthRouteLink({
	to,
	label,
	callbackURL,
	className,
}: AuthRouteLinkProps) {
	return (
		<Link
			to={to}
			search={callbackURL ? { callbackURL } : undefined}
			className={buttonVariants({
				variant: "link",
				className,
			})}
		>
			{label}
		</Link>
	);
}
