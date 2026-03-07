import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../../lib/configs/env.config";

import * as schema from "./schema/auth";

export const db = drizzle(env.DATABASE_URL, { schema });
