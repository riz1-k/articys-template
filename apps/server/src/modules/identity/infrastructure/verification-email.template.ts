import {
	type AuthEmailTemplate,
	createAuthEmailTemplate,
} from "./auth-email.template";

const APP_NAME = "Articys";

export function createVerificationEmailTemplate(input: {
	name: string;
	verificationUrl: string;
}): AuthEmailTemplate {
	return createAuthEmailTemplate({
		title: `Verify your ${APP_NAME} email`,
		subtitle:
			"Confirm your email address to keep your account secure and finish setting up access.",
		ctaLabel: "Verify Email",
		ctaUrl: input.verificationUrl,
		intro: `Hi ${input.name}, thanks for creating your ${APP_NAME} account. Confirm your email address to continue.`,
		helpText:
			"Verifying your email helps us protect your account and ensures we can reach you for important security updates.",
		safetyNote:
			"If you did not create this account, you can ignore this email and no further action is required.",
		textLines: [
			`Verify your ${APP_NAME} email`,
			"",
			`Hi ${input.name},`,
			"",
			`Thanks for creating your ${APP_NAME} account. Confirm your email address to continue.`,
			`Verify your email: ${input.verificationUrl}`,
			"",
			"Verifying your email helps protect your account and ensures we can send important security updates.",
			"If you did not create this account, you can ignore this email.",
		],
	});
}
