import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import AuthAlert from "@/features/auth/components/auth-alert";
import AuthRouteLink from "@/features/auth/components/auth-route-link";
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
				<AuthAlert>
					Your email is confirmed. If the redirect does not happen, continue
					manually below.
				</AuthAlert>
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
			<AuthAlert variant="destructive">{errorMessage}</AuthAlert>
			<div className="flex flex-col gap-3 sm:flex-row">
				<AuthRouteLink
					to="/login"
					callbackURL={callbackURL}
					label="Back to sign in"
					className="justify-center border border-border no-underline hover:no-underline"
				/>
				<AuthRouteLink
					to="/register"
					callbackURL={callbackURL}
					label="Create a fresh account"
					className="justify-center"
				/>
			</div>
		</div>
	);
}
