import { AppError } from "@/core/http/app-error";
import { ErrorCodes } from "@/core/http/error-codes";
import type { BillingRepository } from "@/features/billing/billing.repository";
import type { BillingGatewayPort } from "@/features/billing/billing-gateway.port";
import { STATUS_CODES } from "@/lib/constants";

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
