export interface DependencyHealthStatus {
	name: string;
	status: "ok" | "error" | "disabled";
}

export interface HealthStatusResult {
	status: "ok" | "degraded";
	checks: Record<string, DependencyHealthStatus["status"]>;
	timestamp: string;
}
