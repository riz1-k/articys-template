export interface AuthEmailRecipient {
	email: string;
	name: string;
}

export interface AuthEmailSenderPort {
	sendPasswordResetEmail(input: {
		user: AuthEmailRecipient;
		resetUrl: string;
	}): Promise<void>;
	sendVerificationEmail(input: {
		user: AuthEmailRecipient;
		verificationUrl: string;
	}): Promise<void>;
}
