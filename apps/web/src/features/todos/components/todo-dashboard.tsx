import { CreateTodoCard } from "@/features/todos/components/create-todo-card";
import { TodoDashboardHero } from "@/features/todos/components/todo-dashboard-hero";
import { TodoDashboardSidebar } from "@/features/todos/components/todo-dashboard-sidebar";
import { TodoListCard } from "@/features/todos/components/todo-list-card";
import { useTodoDashboard } from "@/features/todos/hooks/use-todo-dashboard";

interface TodoDashboardProps {
	userName: string;
	userEmail: string;
}

export default function TodoDashboard({
	userName,
	userEmail,
}: TodoDashboardProps) {
	const dashboard = useTodoDashboard();

	return (
		<div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.2fr_0.8fr]">
			<section className="space-y-6">
				<TodoDashboardHero
					userName={userName}
					isRefreshing={dashboard.todosQuery.isFetching}
					onRefresh={() => void dashboard.handleRefresh()}
				/>

				<CreateTodoCard
					title={dashboard.title}
					description={dashboard.description}
					isSubmitting={dashboard.createTodoMutation.isPending}
					onTitleChange={dashboard.setTitle}
					onDescriptionChange={dashboard.setDescription}
					onSubmit={() => void dashboard.handleCreateTodo()}
				/>

				<TodoListCard
					userEmail={userEmail}
					todos={dashboard.todos}
					isLoading={dashboard.todosQuery.isLoading}
					activeTodoId={dashboard.activeTodoId}
					onToggleTodo={(todo) => void dashboard.handleToggleTodo(todo)}
					onDeleteTodo={(todoId) => void dashboard.handleDeleteTodo(todoId)}
				/>
			</section>

			<TodoDashboardSidebar
				total={dashboard.todos.length}
				completed={dashboard.completedCount}
			/>
		</div>
	);
}
