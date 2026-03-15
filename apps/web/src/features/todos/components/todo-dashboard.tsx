import { CheckCircle2, Circle, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	useCreateTodoMutation,
	useDeleteTodoMutation,
	useTodosQuery,
	useUpdateTodoMutation,
} from "@/features/todos/hooks/use-todos";
import type { TodoDto } from "@/features/todos/types/todo";

interface TodoDashboardProps {
	userName: string;
	userEmail: string;
}

export default function TodoDashboard({
	userName,
	userEmail,
}: TodoDashboardProps) {
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

	return (
		<div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.2fr_0.8fr]">
			<section className="space-y-6">
				<div className="border border-border bg-linear-to-r from-amber-50 via-background to-sky-50 p-6 text-foreground dark:from-zinc-900 dark:via-background dark:to-zinc-950">
					<p className="mb-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.35em]">
						Authenticated Workspace
					</p>
					<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
						<div>
							<h1 className="font-semibold text-3xl tracking-tight">
								{userName}&apos;s todo board
							</h1>
							<p className="mt-2 max-w-2xl text-muted-foreground text-sm">
								This dashboard is backed by the authenticated todo API, with
								feature-local hooks handling query state and mutations.
							</p>
						</div>
						<Button
							variant="outline"
							onClick={() => void handleRefresh()}
							disabled={todosQuery.isFetching}
						>
							<RefreshCw />
							Refresh
						</Button>
					</div>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Create Todo</CardTitle>
						<CardDescription>
							Add a new task and persist it through the todo feature client.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-2">
							<Label htmlFor="todo-title">Title</Label>
							<Input
								id="todo-title"
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								placeholder="Ship integration tests"
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="todo-description">Description</Label>
							<Input
								id="todo-description"
								value={description}
								onChange={(event) => setDescription(event.target.value)}
								placeholder="Optional context for the task"
							/>
						</div>
						<Button
							onClick={() => void handleCreateTodo()}
							disabled={createTodoMutation.isPending}
						>
							<Plus />
							{createTodoMutation.isPending ? "Saving..." : "Add Todo"}
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Todo List</CardTitle>
						<CardDescription>
							Your authenticated tasks, scoped to `{userEmail}`.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{todosQuery.isLoading ? (
							<p className="text-muted-foreground">Loading todos...</p>
						) : todos.length === 0 ? (
							<div className="border border-border border-dashed p-6 text-center text-muted-foreground">
								No todos yet. Create one to exercise the new API.
							</div>
						) : (
							<div className="space-y-3">
								{todos.map((todo) => {
									const isActive = activeTodoId === todo.id;

									return (
										<div
											key={todo.id}
											className="flex items-start gap-3 border border-border p-4"
										>
											<Checkbox
												checked={todo.completed}
												onCheckedChange={() => void handleToggleTodo(todo)}
												disabled={isActive}
											/>
											<div className="min-w-0 flex-1">
												<div className="flex items-center gap-2">
													{todo.completed ? (
														<CheckCircle2 className="size-4 text-emerald-600" />
													) : (
														<Circle className="size-4 text-amber-600" />
													)}
													<p
														className={
															todo.completed
																? "text-muted-foreground line-through"
																: "font-medium"
														}
													>
														{todo.title}
													</p>
												</div>
												{todo.description ? (
													<p className="mt-1 text-muted-foreground text-xs">
														{todo.description}
													</p>
												) : null}
											</div>
											<Button
												variant="ghost"
												size="icon-sm"
												onClick={() => void handleDeleteTodo(todo.id)}
												disabled={isActive}
											>
												<Trash2 />
											</Button>
										</div>
									);
								})}
							</div>
						)}
					</CardContent>
				</Card>
			</section>

			<aside className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Progress</CardTitle>
						<CardDescription>
							A quick snapshot of your authenticated task state.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-3">
						<div className="border border-border p-4">
							<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
								Total
							</p>
							<p className="mt-2 font-semibold text-3xl">{todos.length}</p>
						</div>
						<div className="border border-border p-4">
							<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
								Completed
							</p>
							<p className="mt-2 font-semibold text-3xl">{completedCount}</p>
						</div>
						<div className="border border-border p-4">
							<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
								Open
							</p>
							<p className="mt-2 font-semibold text-3xl">
								{Math.max(0, todos.length - completedCount)}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Architecture Notes</CardTitle>
						<CardDescription>
							This page now uses feature-local APIs and hooks instead of a
							component-global fetch layer.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-muted-foreground">
						<p>- auth session comes from Better Auth cookies</p>
						<p>- todo server state is managed with TanStack Query</p>
						<p>- route files stay thin and compose feature components</p>
					</CardContent>
				</Card>
			</aside>
		</div>
	);
}
