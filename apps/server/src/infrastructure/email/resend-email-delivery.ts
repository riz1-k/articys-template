import { Resend } from "resend";
import type { EmailDeliveryPort } from "./email-delivery.port";

export function createResendEmailDelivery(input: {
	apiKey: string;
}): EmailDeliveryPort {
	const resend = new Resend(input.apiKey);

	return {
		async send(message) {
			const response = await resend.emails.send({
				from: message.from,
				to: message.to,
				subject: message.subject,
				html: message.html,
				text: message.text,
				replyTo: message.replyTo,
			});

			if (response.error) {
				throw new Error(
					`Failed to send email through Resend: ${response.error.message}`,
				);
			}
		},
	};
}
