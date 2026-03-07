import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../../configs/env.config";

import * as schema from "./schema";

export const db = drizzle(env.DATABASE_URL, { schema });
