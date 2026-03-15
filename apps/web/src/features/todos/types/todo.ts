export interface TodoDto {
	id: string;
	userId: string;
	title: string;
	description: string | null;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
}
