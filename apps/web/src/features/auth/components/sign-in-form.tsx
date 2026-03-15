import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import FieldError from "@/components/form/field-error";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/features/auth/lib/auth-client";
import { getAuthSuccessPath } from "@/features/auth/lib/auth-flow";
import { MIN_PASSWORD_LENGTH } from "@/lib/constants/validation";

export default function SignInForm({ callbackURL }: { callbackURL?: string }) {
	const navigate = useNavigate({
		from: "/",
	});
	const { isPending } = authClient.useSession();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
					callbackURL,
				},
				{
					onSuccess: () => {
						navigate({
							to: getAuthSuccessPath(callbackURL),
						});
						toast.success("Sign in successful");
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
				password: z
					.string()
					.min(
						MIN_PASSWORD_LENGTH,
						`Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
					),
			}),
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
					Sign in
				</p>
				<h2 className="font-semibold text-3xl tracking-tight">Welcome back</h2>
				<p className="text-muted-foreground text-sm leading-6">
					Sign in to continue into the protected workspace.
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
							<FieldError errors={field.state.meta.errors} />
						</div>
					)}
				</form.Field>

				<form.Field name="password">
					{(field) => (
						<div className="space-y-2">
							<div className="flex items-center justify-between gap-4">
								<Label htmlFor={field.name}>Password</Label>
								<Link
									to="/forgot-password"
									search={callbackURL ? { callbackURL } : undefined}
									className="text-[11px] text-primary uppercase tracking-[0.18em] underline-offset-4 hover:underline"
								>
									Forgot password?
								</Link>
							</div>
							<Input
								id={field.name}
								name={field.name}
								type="password"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							<FieldError errors={field.state.meta.errors} />
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
							{state.isSubmitting ? "Submitting..." : "Sign In"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<div className="border-border border-t pt-4 text-center">
				<p className="text-muted-foreground text-sm">
					Need an account?{" "}
					<Link
						to="/register"
						search={callbackURL ? { callbackURL } : undefined}
						className="text-primary underline-offset-4 hover:underline"
					>
						Create one
					</Link>
				</p>
			</div>
		</div>
	);
}
