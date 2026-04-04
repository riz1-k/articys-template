import {
	type AuthEmailTemplate,
	createAuthEmailTemplate,
} from "./auth-email.template";

const APP_NAME = "Articys";

export function createPasswordResetEmailTemplate(input: {
	name: string;
	resetUrl: string;
}): AuthEmailTemplate {
	return createAuthEmailTemplate({
		title: `Reset your ${APP_NAME} password`,
		subtitle:
			"Use the secure link below to choose a new password and get back into your workspace.",
		ctaLabel: "Reset Password",
		ctaUrl: input.resetUrl,
		intro: `Hi ${input.name}, we received a request to reset the password for your ${APP_NAME} account.`,
		helpText:
			"For your security, this link should only be used by you and may expire if left unused for too long.",
		safetyNote:
			"If you did not request a password reset, you can safely ignore this email and your password will stay unchanged.",
		textLines: [
			`Reset your ${APP_NAME} password`,
			"",
			`Hi ${input.name},`,
			"",
			`We received a request to reset the password for your ${APP_NAME} account.`,
			`Reset your password: ${input.resetUrl}`,
			"",
			"This link should only be used by you and may expire if left unused for too long.",
			"If you did not request a password reset, you can safely ignore this email.",
		],
	});
}
