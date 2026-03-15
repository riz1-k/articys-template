import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/loader";
import Alert from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { authClient } from "@/features/auth/lib/auth-client";
import { getAuthSuccessPath } from "@/features/auth/lib/auth-flow";

type VerifyState = "verifying" | "success" | "error";
const VERIFY_EMAIL_REDIRECT_DELAY_MS = 1200;

export default function VerifyEmailPanel({
	token,
	callbackURL,
}: {
	token?: string;
	callbackURL?: string;
}) {
	const navigate = useNavigate();
	const [state, setState] = useState<VerifyState>(
		token ? "verifying" : "error",
	);
	const [errorMessage, setErrorMessage] = useState(
		"Verification token is missing.",
	);
	const hasStartedRef = useRef(false);

	useEffect(() => {
		if (!token || hasStartedRef.current) {
			return;
		}

		hasStartedRef.current = true;

		void authClient.verifyEmail(
			{
				query: {
					token,
					callbackURL,
				},
			},
			{
				onSuccess: () => {
					setState("success");
					toast.success("Email verified");
					window.setTimeout(() => {
						navigate({
							to: getAuthSuccessPath(callbackURL),
						});
					}, VERIFY_EMAIL_REDIRECT_DELAY_MS);
				},
				onError: (error) => {
					setState("error");
					setErrorMessage(error.error.message || error.error.statusText);
				},
			},
		);
	}, [callbackURL, navigate, token]);

	if (state === "verifying") {
		return (
			<div className="space-y-6">
				<div className="space-y-2">
					<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
						Verify email
					</p>
					<h2 className="font-semibold text-3xl tracking-tight">
						Confirming your address
					</h2>
					<p className="text-muted-foreground text-sm leading-6">
						We are validating the email verification link now.
					</p>
				</div>
				<div className="flex min-h-24 items-center justify-center border border-border bg-card">
					<Loader />
				</div>
			</div>
		);
	}

	if (state === "success") {
		return (
			<div className="space-y-6">
				<div className="space-y-2">
					<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
						Verify email
					</p>
					<h2 className="font-semibold text-3xl tracking-tight">
						Email verified
					</h2>
					<p className="text-muted-foreground text-sm leading-6">
						You will be redirected automatically in a moment.
					</p>
				</div>
				<Alert>
					Your email is confirmed. If the redirect does not happen, continue
					manually below.
				</Alert>
				<Button
					className="h-9 w-full uppercase tracking-[0.18em]"
					onClick={() => {
						navigate({
							to: getAuthSuccessPath(callbackURL),
						});
					}}
				>
					Continue
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.28em]">
					Verify email
				</p>
				<h2 className="font-semibold text-3xl tracking-tight">
					We could not verify this address
				</h2>
				<p className="text-muted-foreground text-sm leading-6">
					The link may be expired, already used, or missing the verification
					token.
				</p>
			</div>
			<Alert variant="destructive">{errorMessage}</Alert>
			<div className="flex flex-col gap-3 sm:flex-row">
				<Link
					to="/login"
					search={callbackURL ? { callbackURL } : undefined}
					className="inline-flex h-8 items-center justify-center border border-border px-2.5 font-medium text-primary text-xs underline-offset-4 transition-all hover:underline"
				>
					Back to sign in
				</Link>
				<Link
					to="/register"
					search={callbackURL ? { callbackURL } : undefined}
					className="inline-flex h-8 items-center justify-center px-2.5 font-medium text-primary text-xs underline-offset-4 transition-all hover:underline"
				>
					Create a fresh account
				</Link>
			</div>
		</div>
	);
}
