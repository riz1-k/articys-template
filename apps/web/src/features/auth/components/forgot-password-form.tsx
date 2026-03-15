import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthAlert from "@/features/auth/components/auth-alert";
import AuthRouteLink from "@/features/auth/components/auth-route-link";
import { authClient } from "@/features/auth/lib/auth-client";
import { getSafeCallbackPath } from "@/features/auth/lib/auth-flow";
import AuthFieldError from "./auth-field-error";

export default function ForgotPasswordForm({
	callbackURL,
}: {
	callbackURL?: string;
}) {
	const [submitted, setSubmitted] = useState(false);

	const form = useForm({
		defaultValues: {
			email: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.requestPasswordReset(
				{
					email: value.email,
					redirectTo: getSafeCallbackPath(callbackURL),
				},
				{
					onSuccess: () => {
						setSubmitted(true);
						toast.success(
							"If the account exists, the reset email is on its way.",
						);
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email address"),
			}),
		},
	});

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
					Password reset
				</p>
				<h2 className="font-semibold text-3xl tracking-tight">
					Request a reset link
				</h2>
				<p className="text-muted-foreground text-sm leading-6">
					We will email a reset link if the address belongs to an account.
				</p>
			</div>

			{submitted ? (
				<div className="space-y-4">
					<AuthAlert>
						Check your email for a password reset link. For privacy, this screen
						looks the same whether or not the address exists.
					</AuthAlert>
					<p className="text-muted-foreground text-sm leading-6">
						When the link opens, the reset page will keep you aligned with the
						same post-auth destination.
					</p>
				</div>
			) : (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<form.Field name="email">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Email</Label>
								<Input
									id={field.name}
									name={field.name}
									type="email"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								<AuthFieldError errors={field.state.meta.errors} />
							</div>
						)}
					</form.Field>

					<form.Subscribe
						selector={(state) => ({
							canSubmit: state.canSubmit,
							isSubmitting: state.isSubmitting,
						})}
					>
						{(state) => (
							<Button
								type="submit"
								className="h-9 w-full uppercase tracking-[0.18em]"
								disabled={!state.canSubmit || state.isSubmitting}
							>
								{state.isSubmitting ? "Sending..." : "Send Reset Link"}
							</Button>
						)}
					</form.Subscribe>
				</form>
			)}

			<div className="border-border border-t pt-4 text-center">
				<p className="text-muted-foreground text-sm">
					Remembered it?{" "}
					<AuthRouteLink
						to="/login"
						callbackURL={callbackURL}
						label="Back to sign in"
						className="h-auto p-0 text-sm"
					/>
				</p>
			</div>
		</div>
	);
}
