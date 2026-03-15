import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { todosClient } from "@/features/todos/api/todos.client";
import type { TodoDto } from "@/features/todos/types/todo";

const TODOS_QUERY_KEY = ["todos"] as const;

export function useTodosQuery() {
	return useQuery({
		queryKey: TODOS_QUERY_KEY,
		queryFn: () => todosClient.list(),
	});
}

export function useCreateTodoMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: todosClient.create,
		onSuccess: (newTodo) => {
			queryClient.setQueryData<TodoDto[]>(TODOS_QUERY_KEY, (current = []) => [
				newTodo,
				...current,
			]);
		},
	});
}

export function useUpdateTodoMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, ...payload }: { id: string } & Partial<TodoDto>) =>
			todosClient.update(id, payload),
		onSuccess: (updatedTodo) => {
			queryClient.setQueryData<TodoDto[]>(TODOS_QUERY_KEY, (current = []) =>
				current.map((todo) =>
					todo.id === updatedTodo.id ? updatedTodo : todo,
				),
			);
		},
	});
}

export function useDeleteTodoMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => todosClient.delete(id),
		onSuccess: (_, deletedId) => {
			queryClient.setQueryData<TodoDto[]>(TODOS_QUERY_KEY, (current = []) =>
				current.filter((todo) => todo.id !== deletedId),
			);
		},
	});
}
