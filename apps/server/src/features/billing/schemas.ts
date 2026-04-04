import { z } from "zod";
import { BILLING_PLANS } from "@/features/billing/subscription";

export const createCheckoutSessionSchema = z.object({
	plan: z.enum(BILLING_PLANS),
});
