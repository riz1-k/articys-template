import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CreateTodoCard } from "./create-todo-card";

describe("CreateTodoCard", () => {
	it("shows the upgrade paywall message when todo creation is blocked", () => {
		render(
			<CreateTodoCard
				title="Todo 6"
				description=""
				isSubmitting={false}
				canCreateMoreTodos={false}
				upgradePrompt="Free users can create up to 5 todos. Upgrade to keep adding more."
				onTitleChange={vi.fn()}
				onDescriptionChange={vi.fn()}
				onSubmit={vi.fn()}
			/>,
		);

		expect(
			screen.getByText(
				"Free users can create up to 5 todos. Upgrade to keep adding more.",
			),
		).not.toBeNull();
		expect(
			screen.getByRole("button", { name: "Upgrade to add more" }),
		).toHaveProperty("disabled", true);
	});
});
