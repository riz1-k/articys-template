import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BILLING_STATUS_QUERY_KEY } from "@/features/billing/hooks/use-billing";
import { todosClient } from "@/features/todos/api/todos-api";
import type { TodoDto } from "@/features/todos/types/todo";

export const TODOS_QUERY_KEY = ["todos"] as const;

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
			void queryClient.invalidateQueries({
				queryKey: BILLING_STATUS_QUERY_KEY,
			});
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
			void queryClient.invalidateQueries({
				queryKey: BILLING_STATUS_QUERY_KEY,
			});
		},
	});
}
