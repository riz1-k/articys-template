import { closeCache, connectCache } from "@/core/cache";
import { closeDatabase, pingDatabase } from "@/core/database";

export async function initializeInfrastructure() {
	await pingDatabase();
	await connectCache();
}

export async function shutdownInfrastructure() {
	await closeDatabase();
	await closeCache();
}

export { closeCache, closeDatabase };
