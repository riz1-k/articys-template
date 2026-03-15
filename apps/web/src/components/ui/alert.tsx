import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AlertProps {
	children: ReactNode;
	variant?: "default" | "destructive";
}

export default function Alert({ children, variant = "default" }: AlertProps) {
	return (
		<div
			className={cn(
				"border px-3 py-2 text-sm leading-6",
				variant === "default"
					? "border-border bg-card text-muted-foreground"
					: "border-destructive/30 bg-destructive/10 text-destructive",
			)}
		>
			{children}
		</div>
	);
}
