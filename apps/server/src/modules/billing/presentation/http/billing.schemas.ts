import { z } from "zod";
import { BILLING_PLANS } from "@/modules/billing/domain/subscription";

export const createCheckoutSessionSchema = z.object({
	plan: z.enum(BILLING_PLANS),
});
