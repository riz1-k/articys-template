import { closeCache, connectCache } from "./cache";
import { closeDatabase } from "./database";

export async function initializeInfrastructure() {
	await connectCache();
}

export async function shutdownInfrastructure() {
	await closeDatabase();
	await closeCache();
}

export { closeCache, closeDatabase };
