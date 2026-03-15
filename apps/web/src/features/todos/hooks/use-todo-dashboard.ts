import { useState } from "react";
import { toast } from "sonner";
import {
	useBillingActions,
	useBillingStatusQuery,
} from "@/features/billing/hooks/use-billing";
import {
	useCreateTodoMutation,
	useDeleteTodoMutation,
	useTodosQuery,
	useUpdateTodoMutation,
} from "@/features/todos/hooks/use-todos";
import type { TodoDto } from "@/features/todos/types/todo";
import { HttpError } from "@/shared/api/http-client";

const DEFAULT_FREE_TODO_LIMIT = 5;

export function useTodoDashboard() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [activeTodoId, setActiveTodoId] = useState<string | null>(null);
	const [upgradePrompt, setUpgradePrompt] = useState<string | null>(null);

	const todosQuery = useTodosQuery();
	const billingQuery = useBillingStatusQuery();
	const billingActions = useBillingActions();
	const createTodoMutation = useCreateTodoMutation();
	const updateTodoMutation = useUpdateTodoMutation();
	const deleteTodoMutation = useDeleteTodoMutation();

	const todos = todosQuery.data ?? [];
	const completedCount = todos.filter((todo) => todo.completed).length;
	const canCreateMoreTodos =
		billingQuery.data?.entitlement.canCreateMoreTodos ?? true;
	const fallbackUpgradePrompt =
		billingQuery.data && !billingQuery.data.entitlement.canCreateMoreTodos
			? `Free users can create up to ${billingQuery.data.entitlement.maxTodos ?? DEFAULT_FREE_TODO_LIMIT} todos. Upgrade to keep adding more.`
			: null;
	const effectiveUpgradePrompt = upgradePrompt ?? fallbackUpgradePrompt;

	async function handleRefresh() {
		try {
			await Promise.all([todosQuery.refetch(), billingQuery.refetch()]);
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
			setUpgradePrompt(null);
			toast.success("Todo created");
		} catch (error) {
			if (
				error instanceof HttpError &&
				error.code === "SUBSCRIPTION_REQUIRED"
			) {
				const limit =
					billingQuery.data?.entitlement.maxTodos ?? DEFAULT_FREE_TODO_LIMIT;
				const message = `Free users can create up to ${limit} todos. Upgrade to keep adding more.`;
				setUpgradePrompt(message);
				toast.error(message);
				return;
			}

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
		billingQuery,
		billingActions,
		upgradePrompt: effectiveUpgradePrompt,
		canCreateMoreTodos,
	};
}
