export interface Todo {
	id: string;
	userId: string;
	title: string;
	description: string | null;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
}
