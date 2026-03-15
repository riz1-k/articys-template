export interface HealthCheckPort {
	name: string;
	check(): Promise<"ok" | "error" | "disabled">;
}
