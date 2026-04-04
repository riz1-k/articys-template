import type { Logger } from "pino";
import type { EmailDeliveryPort } from "./email-delivery.port";

export function createLoggingEmailDelivery(input: {
	logger: Pick<Logger, "info">;
}): EmailDeliveryPort {
	return {
		async send(message) {
			input.logger.info(
				{
					event: "email.delivery.logging",
					...message,
				},
				"Email queued for logging transport",
			);
		},
	};
}
