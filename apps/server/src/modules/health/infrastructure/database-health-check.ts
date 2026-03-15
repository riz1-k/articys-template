import { pingDatabase } from "@/infrastructure/database";

export function createDatabaseHealthCheck() {
	return {
		name: "database",
		async check() {
			return (await pingDatabase()) ? ("ok" as const) : ("error" as const);
		},
	};
}
