export interface EmailMessage {
	from: string;
	to: string;
	subject: string;
	html: string;
	text: string;
	replyTo?: string;
}

export interface EmailDeliveryPort {
	send(message: EmailMessage): Promise<void>;
}
