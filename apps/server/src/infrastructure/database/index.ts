import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { appConfig } from "@/platform/config/app.config";
import { env } from "@/platform/config/env.config";

import * as schema from "./schema";

const pool = new Pool({
	connectionString: env.DATABASE_URL,
	max: appConfig.database.pool.max,
	idleTimeoutMillis: appConfig.database.pool.idleTimeoutMillis,
	connectionTimeoutMillis: appConfig.database.pool.connectionTimeoutMillis,
});

export const db = drizzle(pool, { schema });

export async function pingDatabase(): Promise<boolean> {
	try {
		await pool.query("SELECT 1");
		return true;
	} catch {
		return false;
	}
}

export async function closeDatabase(): Promise<void> {
	await pool.end();
}
