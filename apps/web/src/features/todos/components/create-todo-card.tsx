import { Plus } from "lucide-react";
import Alert from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateTodoCardProps {
	title: string;
	description: string;
	isSubmitting: boolean;
	canCreateMoreTodos: boolean;
	upgradePrompt?: string | null;
	onTitleChange: (value: string) => void;
	onDescriptionChange: (value: string) => void;
	onSubmit: () => void;
}

export function CreateTodoCard({
	title,
	description,
	isSubmitting,
	canCreateMoreTodos,
	upgradePrompt,
	onTitleChange,
	onDescriptionChange,
	onSubmit,
}: CreateTodoCardProps) {
	return (
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
						onChange={(event) => onTitleChange(event.target.value)}
						placeholder="Ship integration tests"
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="todo-description">Description</Label>
					<Input
						id="todo-description"
						value={description}
						onChange={(event) => onDescriptionChange(event.target.value)}
						placeholder="Optional context for the task"
					/>
				</div>
				{upgradePrompt ? <Alert>{upgradePrompt}</Alert> : null}
				<Button
					onClick={onSubmit}
					disabled={isSubmitting || !canCreateMoreTodos}
				>
					<Plus />
					{isSubmitting
						? "Saving..."
						: canCreateMoreTodos
							? "Add Todo"
							: "Upgrade to add more"}
				</Button>
			</CardContent>
		</Card>
	);
}
