import type { EmailDeliveryPort } from "@/core/email/email-delivery.port";
import type { AuthEmailSenderPort } from "@/features/auth/auth-email-sender.port";
import { createPasswordResetEmailTemplate } from "./password-reset-email.template";
import { createVerificationEmailTemplate } from "./verification-email.template";

const DEFAULT_AUTH_EMAIL_FROM = "Articys <no-reply@example.com>";

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
			const template = createPasswordResetEmailTemplate({
				name: user.name,
				resetUrl,
			});

			await input.emailDelivery.send({
				from,
				to: user.email,
				replyTo: input.replyTo,
				subject: template.subject,
				html: template.html,
				text: template.text,
			});
		},
		async sendVerificationEmail({ user, verificationUrl }) {
			const template = createVerificationEmailTemplate({
				name: user.name,
				verificationUrl,
			});

			await input.emailDelivery.send({
				from,
				to: user.email,
				replyTo: input.replyTo,
				subject: template.subject,
				html: template.html,
				text: template.text,
			});
		},
	};
}
