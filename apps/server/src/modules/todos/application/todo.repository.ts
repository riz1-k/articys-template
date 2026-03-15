import type { Todo } from "@/modules/todos/domain/todo";

export interface CreateTodoInput {
	userId: string;
	title: string;
	description?: string | null;
}

export interface UpdateTodoInput {
	id: string;
	userId: string;
	title?: string;
	description?: string | null;
	completed?: boolean;
}

export interface TodoRepository {
	findById(id: string, userId: string): Promise<Todo | null>;
	listByUserId(userId: string): Promise<Todo[]>;
	create(input: CreateTodoInput): Promise<Todo>;
	update(input: UpdateTodoInput): Promise<Todo | null>;
	delete(id: string, userId: string): Promise<boolean>;
}
