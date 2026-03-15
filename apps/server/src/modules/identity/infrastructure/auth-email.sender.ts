import type { EmailDeliveryPort } from "@/infrastructure/email/email-delivery.port";
import type { AuthEmailSenderPort } from "@/modules/identity/application/auth-email-sender.port";

const DEFAULT_AUTH_EMAIL_FROM = "Articys <no-reply@example.com>";
const APP_NAME = "Articys";

export function createAuthEmailSender(input: {
	emailDelivery: EmailDeliveryPort;
	from?: string;
	replyTo?: string;
	isProduction: boolean;
}): AuthEmailSenderPort {
	if (input.isProduction && !input.from) {
		throw new Error(
			"Auth email sender is not configured for production. Configure EMAIL_FROM.",
		);
	}

	const from = input.from ?? DEFAULT_AUTH_EMAIL_FROM;

	return {
		async sendPasswordResetEmail({ user, resetUrl }) {
			await input.emailDelivery.send({
				from,
				to: user.email,
				replyTo: input.replyTo,
				subject: `Reset your ${APP_NAME} password`,
				html: renderPasswordResetHtml(user.name, resetUrl),
				text: renderPasswordResetText(user.name, resetUrl),
			});
		},
		async sendVerificationEmail({ user, verificationUrl }) {
			await input.emailDelivery.send({
				from,
				to: user.email,
				replyTo: input.replyTo,
				subject: `Verify your ${APP_NAME} email`,
				html: renderVerificationHtml(user.name, verificationUrl),
				text: renderVerificationText(user.name, verificationUrl),
			});
		},
	};
}

function renderPasswordResetHtml(name: string, resetUrl: string): string {
	const safeName = escapeHtml(name);
	const safeUrl = escapeHtml(resetUrl);

	return [
		"<div>",
		`<p>Hi ${safeName},</p>`,
		`<p>You requested a password reset for ${APP_NAME}. Use the link below to choose a new password:</p>`,
		`<p><a href="${safeUrl}">Reset your password</a></p>`,
		"<p>If you did not request this, you can ignore this email.</p>",
		"</div>",
	].join("");
}

function renderPasswordResetText(name: string, resetUrl: string): string {
	return [
		`Hi ${name},`,
		"",
		`You requested a password reset for ${APP_NAME}.`,
		`Reset your password: ${resetUrl}`,
		"",
		"If you did not request this, you can ignore this email.",
	].join("\n");
}

function renderVerificationHtml(name: string, verificationUrl: string): string {
	const safeName = escapeHtml(name);
	const safeUrl = escapeHtml(verificationUrl);

	return [
		"<div>",
		`<p>Hi ${safeName},</p>`,
		`<p>Confirm your email address for ${APP_NAME} by using the link below:</p>`,
		`<p><a href="${safeUrl}">Verify your email</a></p>`,
		"<p>If you did not create this account, you can ignore this email.</p>",
		"</div>",
	].join("");
}

function renderVerificationText(name: string, verificationUrl: string): string {
	return [
		`Hi ${name},`,
		"",
		`Confirm your email address for ${APP_NAME}.`,
		`Verify your email: ${verificationUrl}`,
		"",
		"If you did not create this account, you can ignore this email.",
	].join("\n");
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}
