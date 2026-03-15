import { request } from "@/shared/api/http-client";
import type { TodoDto } from "../types/todo";

interface TodoPayload {
	title?: string;
	description?: string | null;
	completed?: boolean;
}

export const todosClient = {
	list() {
		return request<TodoDto[]>("/api/todos");
	},
	create(payload: Required<Pick<TodoPayload, "title">> & TodoPayload) {
		return request<TodoDto>("/api/todos", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},
	update(id: string, payload: TodoPayload) {
		return request<TodoDto>(`/api/todos/${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},
	delete(id: string) {
		return request<void>(`/api/todos/${id}`, {
			method: "DELETE",
		});
	},
};
