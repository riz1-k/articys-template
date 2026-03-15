import { env } from "@/env/web";

const HTTP_NO_CONTENT = 204;

export interface TodoDto {
	id: string;
	userId: string;
	title: string;
	description: string | null;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
}

interface ApiEnvelope<T> {
	success: boolean;
	data: T;
	error?: {
		code: string;
		message: string;
	};
}

interface TodoPayload {
	title?: string;
	description?: string | null;
	completed?: boolean;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
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
		throw new Error(body.error?.message ?? "Request failed");
	}

	return body.data;
}

export const serverApi = {
	listTodos() {
		return request<TodoDto[]>("/api/todos");
	},
	createTodo(payload: Required<Pick<TodoPayload, "title">> & TodoPayload) {
		return request<TodoDto>("/api/todos", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},
	updateTodo(id: string, payload: TodoPayload) {
		return request<TodoDto>(`/api/todos/${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},
	deleteTodo(id: string) {
		return request<void>(`/api/todos/${id}`, {
			method: "DELETE",
		});
	},
};
