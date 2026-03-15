import type { Logger } from "pino";
import type { EmailDeliveryPort } from "./email-delivery.port";
import { createLoggingEmailDelivery } from "./logging-email-delivery";
import { createResendEmailDelivery } from "./resend-email-delivery";

export function createEmailDelivery(input: {
	logger: Pick<Logger, "info">;
	isProduction: boolean;
	resendApiKey?: string;
}): EmailDeliveryPort {
	if (input.resendApiKey) {
		return createResendEmailDelivery({
			apiKey: input.resendApiKey,
		});
	}

	if (input.isProduction) {
		throw new Error(
			"Email delivery is not configured for production. Configure RESEND_API_KEY.",
		);
	}

	return createLoggingEmailDelivery({
		logger: input.logger,
	});
}
