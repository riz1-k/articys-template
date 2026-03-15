import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BillingResultPageProps {
	eyebrow: string;
	title: string;
	description: string;
}

export function BillingResultPage({
	eyebrow,
	title,
	description,
}: BillingResultPageProps) {
	return (
		<div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl items-center px-4 py-10">
			<Card className="w-full">
				<CardHeader>
					<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.35em]">
						{eyebrow}
					</p>
					<CardTitle className="text-2xl">{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-wrap gap-3">
					<Link
						to="/dashboard"
						className={cn(buttonVariants({ variant: "default" }))}
					>
						Back to dashboard
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
