export interface HealthCheckPort {
	name: string;
	check(): Promise<boolean>;
	disabledStatus?: "disabled" | "error";
}
