import { closeCache, connectCache } from "./cache";
import { closeDatabase, pingDatabase } from "./database";

export async function initializeInfrastructure() {
	await pingDatabase();
	await connectCache();
}

export async function shutdownInfrastructure() {
	await closeDatabase();
	await closeCache();
}

export { closeCache, closeDatabase };
