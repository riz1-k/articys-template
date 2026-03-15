import { STATUS_CODES } from "@/lib/constants";
import type { BillingRepository } from "@/modules/billing/application/billing.repository";
import type { BillingGatewayPort } from "@/modules/billing/application/billing-gateway.port";
import { AppError } from "@/platform/http/app-error";
import { ErrorCodes } from "@/platform/http/error-codes";

export function createCreateBillingPortalSessionUseCase(
	billingRepository: BillingRepository,
	billingGateway: BillingGatewayPort,
	returnUrl: string,
) {
	return async ({ userId }: { userId: string }) => {
		const customer = await billingRepository.findCustomerByUserId(userId);

		if (!customer) {
			throw new AppError(
				STATUS_CODES.BAD_REQUEST,
				"No billing profile exists for this user",
				ErrorCodes.BAD_REQUEST,
			);
		}

		return billingGateway.createBillingPortalSession({
			customerId: customer.stripeCustomerId,
			returnUrl,
		});
	};
}
