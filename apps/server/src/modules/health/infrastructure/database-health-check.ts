import { pingDatabase } from "@/infrastructure/database";

export function createDatabaseHealthCheck() {
	return {
		name: "database",
		async check() {
			return pingDatabase();
		},
	};
}
