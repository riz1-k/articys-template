export interface TodoCountPort {
	countTodosByUserId(userId: string): Promise<number>;
}
