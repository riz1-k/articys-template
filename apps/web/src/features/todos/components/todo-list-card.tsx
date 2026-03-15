import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { TodoDto } from "@/features/todos/types/todo";

interface TodoListCardProps {
	userEmail: string;
	todos: TodoDto[];
	isLoading: boolean;
	activeTodoId: string | null;
	onToggleTodo: (todo: TodoDto) => void;
	onDeleteTodo: (todoId: string) => void;
}

export function TodoListCard({
	userEmail,
	todos,
	isLoading,
	activeTodoId,
	onToggleTodo,
	onDeleteTodo,
}: TodoListCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Todo List</CardTitle>
				<CardDescription>
					Your authenticated tasks, scoped to `{userEmail}`.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
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
										onCheckedChange={() => onToggleTodo(todo)}
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
										onClick={() => onDeleteTodo(todo.id)}
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
	);
}
