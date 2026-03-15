import { useState } from "react";
import { toast } from "sonner";
import {
	useCreateTodoMutation,
	useDeleteTodoMutation,
	useTodosQuery,
	useUpdateTodoMutation,
} from "@/features/todos/hooks/use-todos";
import type { TodoDto } from "@/features/todos/types/todo";

export function useTodoDashboard() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [activeTodoId, setActiveTodoId] = useState<string | null>(null);

	const todosQuery = useTodosQuery();
	const createTodoMutation = useCreateTodoMutation();
	const updateTodoMutation = useUpdateTodoMutation();
	const deleteTodoMutation = useDeleteTodoMutation();

	const todos = todosQuery.data ?? [];
	const completedCount = todos.filter((todo) => todo.completed).length;

	async function handleRefresh() {
		try {
			await todosQuery.refetch();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to load todos",
			);
		}
	}

	async function handleCreateTodo() {
		if (!title.trim()) {
			toast.error("Title is required");
			return;
		}

		try {
			await createTodoMutation.mutateAsync({
				title: title.trim(),
				description: description.trim() || null,
			});
			setTitle("");
			setDescription("");
			toast.success("Todo created");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to create todo",
			);
		}
	}

	async function handleToggleTodo(todo: TodoDto) {
		setActiveTodoId(todo.id);
		try {
			await updateTodoMutation.mutateAsync({
				id: todo.id,
				completed: !todo.completed,
			});
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to update todo",
			);
		} finally {
			setActiveTodoId(null);
		}
	}

	async function handleDeleteTodo(todoId: string) {
		setActiveTodoId(todoId);
		try {
			await deleteTodoMutation.mutateAsync(todoId);
			toast.success("Todo deleted");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to delete todo",
			);
		} finally {
			setActiveTodoId(null);
		}
	}

	return {
		title,
		setTitle,
		description,
		setDescription,
		activeTodoId,
		todosQuery,
		createTodoMutation,
		todos,
		completedCount,
		handleRefresh,
		handleCreateTodo,
		handleToggleTodo,
		handleDeleteTodo,
	};
}
