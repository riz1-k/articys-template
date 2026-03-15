import { env } from "@/configs/env";

const HTTP_NO_CONTENT = 204;

interface ApiEnvelope<T> {
	success: boolean;
	data: T;
	error?: {
		code: string;
		message: string;
	};
}

export class HttpError extends Error {
	constructor(
		message: string,
		public code?: string,
		public status?: number,
	) {
		super(message);
		this.name = "HttpError";
	}
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${env.VITE_SERVER_URL}${path}`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...(init?.headers ?? {}),
		},
		...init,
	});

	if (response.status === HTTP_NO_CONTENT) {
		return undefined as T;
	}

	const body = (await response.json()) as ApiEnvelope<T>;

	if (!response.ok || !body.success) {
		throw new HttpError(
			body.error?.message ?? "Request failed",
			body.error?.code,
			response.status,
		);
	}

	return body.data;
}
