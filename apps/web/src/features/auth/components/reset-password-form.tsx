import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthAlert from "@/features/auth/components/auth-alert";
import AuthRouteLink from "@/features/auth/components/auth-route-link";
import { authClient } from "@/features/auth/lib/auth-client";
import { getPostResetLoginPath } from "@/features/auth/lib/auth-flow";
import { MIN_PASSWORD_LENGTH } from "@/lib/constants/validation";
import AuthFieldError from "./auth-field-error";

export default function ResetPasswordForm({
	token,
	callbackURL,
}: {
	token?: string;
	callbackURL?: string;
}) {
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		onSubmit: async ({ value }) => {
			if (!token) {
				return;
			}

			await authClient.resetPassword(
				{
					newPassword: value.password,
					token,
				},
				{
					onSuccess: () => {
						navigate({
							to: getPostResetLoginPath(callbackURL),
						});
						toast.success("Password reset successful");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z
				.object({
					password: z
						.string()
						.min(
							MIN_PASSWORD_LENGTH,
							`Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
						),
					confirmPassword: z.string(),
				})
				.refine((value) => value.password === value.confirmPassword, {
					path: ["confirmPassword"],
					message: "Passwords must match",
				}),
		},
	});

	if (!token) {
		return (
			<div className="space-y-6">
				<div className="space-y-2">
					<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
						Reset password
					</p>
					<h2 className="font-semibold text-3xl tracking-tight">
						This reset link is incomplete
					</h2>
					<p className="text-muted-foreground text-sm leading-6">
						The token is missing or invalid. Request a fresh password reset
						email to continue.
					</p>
				</div>

				<AuthAlert variant="destructive">
					Open the latest reset email, or request a new link if this one has
					expired.
				</AuthAlert>

				<div className="flex flex-col gap-3 sm:flex-row">
					<AuthRouteLink
						to="/forgot-password"
						callbackURL={callbackURL}
						label="Request new reset link"
						className="justify-center border border-border no-underline hover:no-underline"
					/>
					<AuthRouteLink
						to="/login"
						callbackURL={callbackURL}
						label="Back to sign in"
						className="justify-center"
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
					Reset password
				</p>
				<h2 className="font-semibold text-3xl tracking-tight">
					Set a new password
				</h2>
				<p className="text-muted-foreground text-sm leading-6">
					Choose a new password for your account, then sign in again.
				</p>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<form.Field name="password">
					{(field) => (
						<div className="space-y-2">
							<Label htmlFor={field.name}>New password</Label>
							<Input
								id={field.name}
								name={field.name}
								type="password"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							<AuthFieldError errors={field.state.meta.errors} />
						</div>
					)}
				</form.Field>

				<form.Field name="confirmPassword">
					{(field) => (
						<div className="space-y-2">
							<Label htmlFor={field.name}>Confirm password</Label>
							<Input
								id={field.name}
								name={field.name}
								type="password"
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
							{state.isSubmitting ? "Saving..." : "Reset Password"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<div className="border-border border-t pt-4 text-center">
				<p className="text-muted-foreground text-sm">
					Need to start over?{" "}
					<AuthRouteLink
						to="/forgot-password"
						callbackURL={callbackURL}
						label="Request another link"
						className="h-auto p-0 text-sm"
					/>
				</p>
			</div>
		</div>
	);
}
